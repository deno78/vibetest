import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface StockData {
  id: string;
  symbol: string;
  companyName: string;
  price: number;
  quantity: number;
  registeredAt: Date;
}

export interface YahooFinanceData {
  symbol: string;
  shortName: string;
  longName?: string;
  regularMarketPrice?: number | null;
  currency?: string;
  marketState?: string;
  fullExchangeName?: string;
  displayName?: string;
}

export interface YahooFinanceSearchResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  typeDisp?: string;
  quoteType?: string;
}

export interface DividendData {
  symbol: string;
  exDate: Date;
  paymentDate: Date;
  amount: number;
  currency: string;
}

export interface DividendCalendarItem {
  stock: StockData;
  dividend: DividendData;
  totalDividend: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly STORAGE_KEY = 'stock_registrations';

  // Mock dividend data - in production, this would come from Yahoo Finance API
  private mockDividendData: DividendData[] = [
    // AAPL quarterly dividends
    { symbol: 'AAPL', exDate: new Date('2025-11-08'), paymentDate: new Date('2025-11-14'), amount: 0.24, currency: 'USD' },
    { symbol: 'AAPL', exDate: new Date('2026-02-07'), paymentDate: new Date('2026-02-13'), amount: 0.25, currency: 'USD' },
    { symbol: 'AAPL', exDate: new Date('2026-05-09'), paymentDate: new Date('2026-05-15'), amount: 0.25, currency: 'USD' },
    { symbol: 'AAPL', exDate: new Date('2026-08-08'), paymentDate: new Date('2026-08-14'), amount: 0.26, currency: 'USD' },
    // GOOGL quarterly dividends  
    { symbol: 'GOOGL', exDate: new Date('2025-12-13'), paymentDate: new Date('2025-12-19'), amount: 0.20, currency: 'USD' },
    { symbol: 'GOOGL', exDate: new Date('2026-03-14'), paymentDate: new Date('2026-03-20'), amount: 0.21, currency: 'USD' },
    { symbol: 'GOOGL', exDate: new Date('2026-06-13'), paymentDate: new Date('2026-06-19'), amount: 0.21, currency: 'USD' },
    { symbol: 'GOOGL', exDate: new Date('2026-09-12'), paymentDate: new Date('2026-09-18'), amount: 0.22, currency: 'USD' },
    // MSFT quarterly dividends
    { symbol: 'MSFT', exDate: new Date('2025-11-20'), paymentDate: new Date('2025-12-12'), amount: 0.75, currency: 'USD' },
    { symbol: 'MSFT', exDate: new Date('2026-02-19'), paymentDate: new Date('2026-03-12'), amount: 0.78, currency: 'USD' },
    { symbol: 'MSFT', exDate: new Date('2026-05-21'), paymentDate: new Date('2026-06-11'), amount: 0.78, currency: 'USD' },
    { symbol: 'MSFT', exDate: new Date('2026-08-20'), paymentDate: new Date('2026-09-10'), amount: 0.80, currency: 'USD' },
    // Japanese stocks - semi-annual dividends
    { symbol: '7203.T', exDate: new Date('2026-03-28'), paymentDate: new Date('2026-06-27'), amount: 75, currency: 'JPY' },
    { symbol: '7203.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 75, currency: 'JPY' },
    { symbol: '6758.T', exDate: new Date('2026-03-30'), paymentDate: new Date('2026-06-27'), amount: 45, currency: 'JPY' },
    { symbol: '6758.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 45, currency: 'JPY' },
    { symbol: '9984.T', exDate: new Date('2026-03-30'), paymentDate: new Date('2026-06-27'), amount: 55, currency: 'JPY' },
    { symbol: '9984.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 55, currency: 'JPY' }
  ];

  constructor(private http: HttpClient) {}

  // Get stock info from Yahoo Finance API
  searchStock(query: string): Observable<YahooFinanceData[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    // Try multiple Yahoo Finance endpoints
    return this.tryYahooFinanceSearch(query).pipe(
      catchError(error => {
        console.error('All Yahoo Finance endpoints failed, using fallback:', error);
        return this.searchStockMock(query);
      })
    );
  }

  private tryYahooFinanceSearch(query: string): Observable<YahooFinanceData[]> {
    // First try: Yahoo Finance search endpoint
    const searchUrl = `/api/yahoo/v1/finance/search`;
    const params = {
      q: query.trim(),
      quotes_count: '10',
      news_count: '0'
    };

    return this.http.get<any>(searchUrl, { params }).pipe(
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

  // Alternative free API - Financial Modeling Prep (has free tier)
  private tryFinancialModelingPrepAPI(query: string): Observable<YahooFinanceData[]> {
    // This is a free API that doesn't require CORS proxy
    const apiUrl = `https://financialmodelingprep.com/api/v3/search`;
    const params = {
      query: query.trim(),
      limit: '10',
      apikey: 'demo' // Using demo key for testing
    };

    return this.http.get<any[]>(apiUrl, { params }).pipe(
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

  // Fallback mock search for when API is unavailable
  private searchStockMock(query: string): Observable<YahooFinanceData[]> {
    const mockData: YahooFinanceData[] = [
      { symbol: 'AAPL', shortName: 'Apple Inc.', regularMarketPrice: 189.79 },
      { symbol: '7203.T', shortName: 'Toyota Motor Corporation', regularMarketPrice: 2891 },
      { symbol: '6758.T', shortName: 'Sony Group Corporation', regularMarketPrice: 13540 },
      { symbol: '9984.T', shortName: 'SoftBank Group Corp.', regularMarketPrice: 7342 },
      { symbol: 'GOOGL', shortName: 'Alphabet Inc.', regularMarketPrice: 159.40 },
      { symbol: 'MSFT', shortName: 'Microsoft Corporation', regularMarketPrice: 416.06 },
      { symbol: 'TSLA', shortName: 'Tesla, Inc.', regularMarketPrice: 249.83 }
    ];

    return of(mockData.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.shortName.toLowerCase().includes(query.toLowerCase())
    ));
  }

  // Save stock registration to local storage
  registerStock(stockData: Omit<StockData, 'id' | 'registeredAt'>): void {
    const newStock: StockData = {
      ...stockData,
      id: this.generateId(),
      registeredAt: new Date()
    };

    const currentStocks = this.getRegisteredStocks();
    currentStocks.push(newStock);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentStocks));
  }

  // Get all registered stocks from local storage
  getRegisteredStocks(): StockData[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((stock: any) => ({
        ...stock,
        registeredAt: new Date(stock.registeredAt)
      }));
    }
    return [];
  }

  // Remove registered stock
  removeStock(id: string): void {
    const currentStocks = this.getRegisteredStocks();
    const updatedStocks = currentStocks.filter(stock => stock.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStocks));
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get upcoming dividends for the next 12 months
  getUpcomingDividends(): DividendCalendarItem[] {
    const registeredStocks = this.getRegisteredStocks();
    const now = new Date();
    const twelveMonthsFromNow = new Date();
    twelveMonthsFromNow.setFullYear(now.getFullYear() + 1);

    const upcomingDividends: DividendCalendarItem[] = [];

    registeredStocks.forEach(stock => {
      const stockDividends = this.mockDividendData.filter(dividend => 
        dividend.symbol === stock.symbol &&
        dividend.paymentDate >= now &&
        dividend.paymentDate <= twelveMonthsFromNow
      );

      stockDividends.forEach(dividend => {
        upcomingDividends.push({
          stock: stock,
          dividend: dividend,
          totalDividend: dividend.amount * stock.quantity
        });
      });
    });

    // Sort by payment date
    return upcomingDividends.sort((a, b) => a.dividend.paymentDate.getTime() - b.dividend.paymentDate.getTime());
  }

  // Calculate total expected dividends for next 12 months
  getTotalUpcomingDividends(): { jpy: number, usd: number } {
    const upcomingDividends = this.getUpcomingDividends();
    let totalJPY = 0;
    let totalUSD = 0;

    upcomingDividends.forEach(item => {
      if (item.dividend.currency === 'JPY') {
        totalJPY += item.totalDividend;
      } else if (item.dividend.currency === 'USD') {
        totalUSD += item.totalDividend;
      }
    });

    return { jpy: totalJPY, usd: totalUSD };
  }

  // Get dividends by month for charting/calendar view
  getDividendsByMonth(): { [month: string]: DividendCalendarItem[] } {
    const upcomingDividends = this.getUpcomingDividends();
    const dividendsByMonth: { [month: string]: DividendCalendarItem[] } = {};

    upcomingDividends.forEach(dividend => {
      const monthKey = dividend.dividend.paymentDate.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!dividendsByMonth[monthKey]) {
        dividendsByMonth[monthKey] = [];
      }
      
      dividendsByMonth[monthKey].push(dividend);
    });

    return dividendsByMonth;
  }
}