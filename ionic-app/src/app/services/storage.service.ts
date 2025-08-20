import { Injectable } from '@angular/core';
import { StockData } from '../models';
import { STORAGE_KEYS } from '../constants';
import { generateUniqueId } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Save stock registration to local storage
   */
  registerStock(stockData: Omit<StockData, 'id' | 'registeredAt'>): void {
    const newStock: StockData = {
      ...stockData,
      id: generateUniqueId(),
      registeredAt: new Date()
    };

    const currentStocks = this.getRegisteredStocks();
    currentStocks.push(newStock);
    this.saveStocks(currentStocks);
  }

  /**
   * Get all registered stocks from local storage
   */
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

  /**
   * Remove registered stock by ID
   */
  removeStock(id: string): void {
    const currentStocks = this.getRegisteredStocks();
    const updatedStocks = currentStocks.filter(stock => stock.id !== id);
    this.saveStocks(updatedStocks);
  }

  /**
   * Save stocks array to local storage
   */
  private saveStocks(stocks: StockData[]): void {
    localStorage.setItem(STORAGE_KEYS.STOCK_REGISTRATIONS, JSON.stringify(stocks));
  }
}