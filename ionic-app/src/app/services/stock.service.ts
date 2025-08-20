import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { YahooFinanceData } from '../models';
import { 
  API_ENDPOINTS, 
  SEARCH_CONFIG, 
  MOCK_STOCK_DATA 
} from '../constants';
import { isValidSearchQuery, filterByQuery } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) {}

  /**
   * Search for stocks using external APIs with fallback
   */
  searchStock(query: string): Observable<YahooFinanceData[]> {
    if (!isValidSearchQuery(query)) {
      return of([]);
    }

    return this.tryYahooFinanceSearch(query).pipe(
      catchError(error => {
        console.error('All Yahoo Finance endpoints failed, using fallback:', error);
        return this.searchStockMock(query);
      })
    );
  }

  /**
   * Try Yahoo Finance search endpoint
   */
  private tryYahooFinanceSearch(query: string): Observable<YahooFinanceData[]> {
    const params = {
      q: query.trim(),
      quotes_count: SEARCH_CONFIG.QUOTES_COUNT,
      news_count: SEARCH_CONFIG.NEWS_COUNT
    };

    return this.http.get<any>(API_ENDPOINTS.YAHOO_FINANCE_SEARCH, { params }).pipe(
      map(response => {
        if (response && response.quotes) {
          return response.quotes
            .filter((quote: any) => 
              quote.quoteType === 'EQUITY' || 
              quote.quoteType === 'ETF' ||
              quote.typeDisp === 'Equity'
            )
            .map((quote: any) => ({
              symbol: quote.symbol,
              shortName: quote.shortname || quote.longname || quote.symbol,
              longName: quote.longname,
              regularMarketPrice: undefined, // Will try to fetch separately
              currency: quote.currency,
              marketState: quote.marketState,
              fullExchangeName: quote.exchDisp,
              displayName: quote.displayName || quote.shortname || quote.symbol
            } as YahooFinanceData));
        }
        return [];
      }),
      // If search fails, try alternative approach
      catchError(() => this.tryFinancialModelingPrepAPI(query))
    );
  }

  /**
   * Alternative API fallback - Financial Modeling Prep
   */
  private tryFinancialModelingPrepAPI(query: string): Observable<YahooFinanceData[]> {
    const params = {
      query: query.trim(),
      limit: SEARCH_CONFIG.LIMIT,
      apikey: SEARCH_CONFIG.DEMO_API_KEY
    };

    return this.http.get<any[]>(API_ENDPOINTS.FINANCIAL_MODELING_PREP, { params }).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(item => ({
            symbol: item.symbol,
            shortName: item.name || item.symbol,
            longName: item.name,
            regularMarketPrice: undefined,
            currency: item.currency || 'USD',
            fullExchangeName: item.exchangeShortName,
            displayName: item.name || item.symbol
          } as YahooFinanceData));
        }
        return [];
      }),
      catchError(() => {
        // If both APIs fail, return empty array to trigger fallback
        throw new Error('All external APIs failed');
      })
    );
  }

  /**
   * Fallback mock search for when APIs are unavailable
   */
  private searchStockMock(query: string): Observable<YahooFinanceData[]> {
    return of(filterByQuery(MOCK_STOCK_DATA, query, ['symbol', 'shortName']));
  }
}