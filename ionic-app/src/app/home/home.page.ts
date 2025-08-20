import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { StorageService } from '../services/storage.service';
import { DividendService } from '../services/dividend.service';
import { 
  StockData, 
  YahooFinanceData, 
  DividendCalendarItem, 
  DividendTotals 
} from '../models';
import { 
  formatCurrency, 
  calculateTotalValue, 
  isStockFormValid 
} from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  searchQuery: string = '';
  selectedStock: YahooFinanceData | null = null;
  quantity: number = 1;
  customPrice: number | null = null;
  
  searchResults: YahooFinanceData[] = [];
  registeredStocks: StockData[] = [];
  showSearchResults: boolean = false;

  // Dividend calendar data
  upcomingDividends: DividendCalendarItem[] = [];
  totalUpcomingDividends: DividendTotals = { jpy: 0, usd: 0 };
  dividendsByMonth: { [month: string]: DividendCalendarItem[] } = {};

  constructor(
    private stockService: StockService,
    private storageService: StorageService,
    private dividendService: DividendService
  ) {}

  ngOnInit() {
    this.loadRegisteredStocks();
    this.loadDividendData();
  }

  /**
   * Search for stocks using the service
   */
  onSearchInput() {
    if (this.searchQuery.trim().length > 0) {
      this.stockService.searchStock(this.searchQuery).subscribe(
        results => {
          this.searchResults = results;
          this.showSearchResults = results.length > 0;
        }
      );
    } else {
      this.clearSearchResults();
    }
  }

  /**
   * Select a stock from search results
   */
  selectStock(stock: YahooFinanceData) {
    this.selectedStock = stock;
    this.searchQuery = `${stock.symbol} - ${stock.shortName}`;
    this.customPrice = stock.regularMarketPrice || null;
    this.showSearchResults = false;
  }

  /**
   * Register the selected stock
   */
  registerStock() {
    if (this.selectedStock && this.quantity > 0) {
      const stockData = {
        symbol: this.selectedStock.symbol,
        companyName: this.selectedStock.shortName,
        price: this.customPrice || this.selectedStock.regularMarketPrice || 0,
        quantity: this.quantity
      };

      this.storageService.registerStock(stockData);
      this.loadRegisteredStocks();
      this.loadDividendData();
      this.resetForm();
    }
  }

  /**
   * Load registered stocks from storage
   */
  loadRegisteredStocks() {
    this.registeredStocks = this.storageService.getRegisteredStocks();
  }

  /**
   * Load dividend data
   */
  loadDividendData() {
    this.upcomingDividends = this.dividendService.getUpcomingDividends(this.registeredStocks);
    this.totalUpcomingDividends = this.dividendService.getTotalUpcomingDividends(this.upcomingDividends);
    this.dividendsByMonth = this.dividendService.getDividendsByMonth(this.upcomingDividends);
  }

  /**
   * Remove a registered stock
   */
  removeStock(id: string) {
    this.storageService.removeStock(id);
    this.loadRegisteredStocks();
    this.loadDividendData();
  }

  /**
   * Reset the form
   */
  resetForm() {
    this.searchQuery = '';
    this.selectedStock = null;
    this.quantity = 1;
    this.customPrice = null;
    this.clearSearchResults();
  }

  /**
   * Clear search results
   */
  private clearSearchResults() {
    this.searchResults = [];
    this.showSearchResults = false;
  }

  /**
   * Check if form is valid for registration
   */
  isFormValid(): boolean {
    return isStockFormValid(this.selectedStock, this.quantity, this.customPrice);
  }

  /**
   * Calculate total value for a stock
   */
  getTotalValue(stock: StockData): number {
    return calculateTotalValue(stock.price, stock.quantity);
  }

  /**
   * Get month names for dividend calendar
   */
  getMonthNames(): string[] {
    return Object.keys(this.dividendsByMonth);
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string): string {
    return formatCurrency(amount, currency);
  }
}