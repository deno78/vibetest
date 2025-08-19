import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  StockData,
  YahooFinanceData,
  DividendData,
  DividendCalendarItem,
  DividendTotals
} from '../models';
import { 
  MOCK_STOCK_DATA, 
  MOCK_DIVIDEND_DATA, 
  STORAGE_KEYS, 
  DATE_CONSTANTS 
} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly mockDividendData: DividendData[] = MOCK_DIVIDEND_DATA;

  constructor(private http: HttpClient) {}

  // ============ Stock Search Methods ============

  // Get stock info from Yahoo Finance (simplified mock for now)
  // In production, you would use Yahoo Finance API with proper CORS handling
  searchStock(query: string): Observable<YahooFinanceData[]> {
    // Mock data for demonstration - in real implementation, use Yahoo Finance API
    return of(MOCK_STOCK_DATA.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.shortName.toLowerCase().includes(query.toLowerCase())
    ));
  }

  // ============ Stock Registration Methods ============

  // Save stock registration to local storage
  registerStock(stockData: Omit<StockData, 'id' | 'registeredAt'>): void {
    const newStock: StockData = {
      ...stockData,
      id: this.generateId(),
      registeredAt: new Date()
    };

    const currentStocks = this.getRegisteredStocks();
    currentStocks.push(newStock);
    localStorage.setItem(STORAGE_KEYS.STOCK_REGISTRATIONS, JSON.stringify(currentStocks));
  }

  // Get all registered stocks from local storage
  getRegisteredStocks(): StockData[] {
    const stored = localStorage.getItem(STORAGE_KEYS.STOCK_REGISTRATIONS);
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
    localStorage.setItem(STORAGE_KEYS.STOCK_REGISTRATIONS, JSON.stringify(updatedStocks));
  }

  // ============ Dividend Calculation Methods ============

  // Get upcoming dividends for the next 12 months
  getUpcomingDividends(): DividendCalendarItem[] {
    const registeredStocks = this.getRegisteredStocks();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + DATE_CONSTANTS.MONTHS_AHEAD_FOR_DIVIDENDS);

    const upcomingDividends: DividendCalendarItem[] = [];

    registeredStocks.forEach(stock => {
      const stockDividends = this.mockDividendData.filter(dividend => 
        dividend.symbol === stock.symbol &&
        dividend.paymentDate >= now &&
        dividend.paymentDate <= futureDate
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
    return upcomingDividends.sort((a, b) => 
      a.dividend.paymentDate.getTime() - b.dividend.paymentDate.getTime()
    );
  }

  // Calculate total expected dividends for next 12 months
  getTotalUpcomingDividends(): DividendTotals {
    const upcomingDividends = this.getUpcomingDividends();
    
    const totals = upcomingDividends.reduce(
      (acc, item) => {
        if (item.dividend.currency === 'JPY') {
          acc.jpy += item.totalDividend;
        } else if (item.dividend.currency === 'USD') {
          acc.usd += item.totalDividend;
        }
        return acc;
      },
      { jpy: 0, usd: 0 }
    );

    return totals;
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

  // ============ Private Utility Methods ============

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}