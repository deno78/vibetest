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
        // Log error for debugging but don't expose to user
        console.warn('Yahoo Finance API unavailable, using local data:', error.message);
        
        // Directly use mock data as fallback for PWA reliability
        const mockResults = filterByQuery(MOCK_STOCK_DATA, query, ['symbol', 'shortName']);
        if (mockResults.length > 0) {
          console.log('Using local stock data:', mockResults.length, 'results found');
          return of(mockResults);
        }
        
        // Return empty array if no matches found
        return of([]);
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
              regularMarketPrice: quote.regularMarketPrice, // Include price from search
              currency: quote.currency,
              marketState: quote.marketState,
              fullExchangeName: quote.exchDisp,
              displayName: quote.displayName || quote.shortname || quote.symbol
            } as YahooFinanceData));
        }
        return [];
      }),
      // If search fails, let main error handler deal with it
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Removed unreliable Financial Modeling Prep API to improve PWA stability
   * This method is kept for backwards compatibility but no longer used
   */
  private tryFinancialModelingPrepAPI(query: string): Observable<YahooFinanceData[]> {
    // This API was causing 401 Unauthorized and CORS issues in PWA environment
    // Return empty array to allow fallback to mock data
    return of([]);
  }

  /**
   * Fallback mock search for when APIs are unavailable
   */
  private searchStockMock(query: string): Observable<YahooFinanceData[]> {
    return of(filterByQuery(MOCK_STOCK_DATA, query, ['symbol', 'shortName']));
  }

  /**
   * Get stock quote by exact symbol - for validating specific stock codes
   */
  getStockBySymbol(symbol: string): Observable<YahooFinanceData | null> {
    if (!isValidSearchQuery(symbol)) {
      return of(null);
    }

    const params = {
      q: symbol.trim(),
      quotes_count: '1',
      news_count: '0'
    };

    return this.http.get<any>(API_ENDPOINTS.YAHOO_FINANCE_SEARCH, { params }).pipe(
      map(response => {
        if (response && response.quotes && response.quotes.length > 0) {
          const quote = response.quotes[0];
          if (quote.symbol.toLowerCase() === symbol.toLowerCase()) {
            return {
              symbol: quote.symbol,
              shortName: quote.shortname || quote.longname || quote.symbol,
              longName: quote.longname,
              regularMarketPrice: quote.regularMarketPrice,
              currency: quote.currency,
              marketState: quote.marketState,
              fullExchangeName: quote.exchDisp,
              displayName: quote.displayName || quote.shortname || quote.symbol
            } as YahooFinanceData;
          }
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}