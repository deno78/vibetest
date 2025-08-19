import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface StockData {
  id: string;
  symbol: string;
  companyName: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  registeredAt: Date;
}

export interface YahooFinanceData {
  symbol: string;
  shortName: string;
  regularMarketPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly STORAGE_KEY = 'stock_registrations';

  constructor(private http: HttpClient) {}

  // Get stock info from Yahoo Finance (simplified mock for now)
  // In production, you would use Yahoo Finance API with proper CORS handling
  searchStock(query: string): Observable<YahooFinanceData[]> {
    // Mock data for demonstration - in real implementation, use Yahoo Finance API
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

  // Get current price for a specific stock symbol from Yahoo Finance API
  getCurrentPrice(symbol: string): Observable<number> {
    // Mock implementation that simulates price changes
    // In production, this would call real Yahoo Finance API
    const basePrice = this.getBasePriceForSymbol(symbol);
    // Simulate price fluctuation between -5% to +5%
    const fluctuation = (Math.random() - 0.5) * 0.1;
    const currentPrice = basePrice * (1 + fluctuation);
    return of(currentPrice);
  }

  // Get current prices for multiple symbols
  getCurrentPrices(symbols: string[]): Observable<{[symbol: string]: number}> {
    const priceMap: {[symbol: string]: number} = {};
    symbols.forEach(symbol => {
      const basePrice = this.getBasePriceForSymbol(symbol);
      const fluctuation = (Math.random() - 0.5) * 0.1;
      priceMap[symbol] = basePrice * (1 + fluctuation);
    });
    return of(priceMap);
  }

  // Helper method to get base price for a symbol
  private getBasePriceForSymbol(symbol: string): number {
    const symbolPrices: {[key: string]: number} = {
      'AAPL': 189.79,
      '7203.T': 2891,
      '6758.T': 13540,
      '9984.T': 7342,
      'GOOGL': 159.40,
      'MSFT': 416.06,
      'TSLA': 249.83
    };
    return symbolPrices[symbol] || 100; // Default price if symbol not found
  }

  // Update current prices for all registered stocks
  updateAllStockPrices(): Observable<void> {
    return new Observable(observer => {
      const stocks = this.getRegisteredStocks();
      if (stocks.length === 0) {
        observer.next();
        observer.complete();
        return;
      }

      const symbols = stocks.map(stock => stock.symbol);
      this.getCurrentPrices(symbols).subscribe(priceMap => {
        const updatedStocks = stocks.map(stock => ({
          ...stock,
          currentPrice: priceMap[stock.symbol] || stock.currentPrice
        }));
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStocks));
        observer.next();
        observer.complete();
      });
    });
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
}