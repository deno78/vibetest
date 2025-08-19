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