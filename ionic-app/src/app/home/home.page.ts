import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import {
  StockData,
  YahooFinanceData,
  DividendCalendarItem,
  DividendTotals
} from '../models';
import { CurrencyUtils } from '../utils';
import { VALIDATION_CONSTANTS } from '../constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // ============ Form Properties ============
  searchQuery: string = '';
  selectedStock: YahooFinanceData | null = null;
  quantity: number = 1;
  customPrice: number | null = null;
  
  // ============ Display Properties ============
  searchResults: YahooFinanceData[] = [];
  registeredStocks: StockData[] = [];
  showSearchResults: boolean = false;

  // ============ Dividend Properties ============
  upcomingDividends: DividendCalendarItem[] = [];
  totalUpcomingDividends: DividendTotals = { jpy: 0, usd: 0 };
  dividendsByMonth: { [month: string]: DividendCalendarItem[] } = {};

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  // ============ Initialization Methods ============

  private loadInitialData(): void {
    this.loadRegisteredStocks();
    this.loadDividendData();
  }

  // ============ Search Methods ============

  // Search for stocks using the service
  onSearchInput(): void {
    if (this.searchQuery.trim().length >= VALIDATION_CONSTANTS.MIN_SEARCH_LENGTH) {
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

  // Select a stock from search results
  selectStock(stock: YahooFinanceData): void {
    this.selectedStock = stock;
    this.searchQuery = `${stock.symbol} - ${stock.shortName}`;
    this.customPrice = stock.regularMarketPrice || null;
    this.showSearchResults = false;
  }

  private clearSearchResults(): void {
    this.searchResults = [];
    this.showSearchResults = false;
  }

  // ============ Stock Registration Methods ============

  // Register the selected stock
  registerStock(): void {
    if (!this.isFormValid()) {
      return;
    }

    const stockData = {
      symbol: this.selectedStock!.symbol,
      companyName: this.selectedStock!.shortName,
      price: this.customPrice || this.selectedStock!.regularMarketPrice || 0,
      quantity: this.quantity
    };

    this.stockService.registerStock(stockData);
    this.refreshData();
    this.resetForm();
  }

  // Remove a registered stock
  removeStock(id: string): void {
    this.stockService.removeStock(id);
    this.refreshData();
  }

  // ============ Data Loading Methods ============

  // Load registered stocks from storage
  private loadRegisteredStocks(): void {
    this.registeredStocks = this.stockService.getRegisteredStocks();
  }

  // Load dividend data
  private loadDividendData(): void {
    this.upcomingDividends = this.stockService.getUpcomingDividends();
    this.totalUpcomingDividends = this.stockService.getTotalUpcomingDividends();
    this.dividendsByMonth = this.stockService.getDividendsByMonth();
  }

  private refreshData(): void {
    this.loadRegisteredStocks();
    this.loadDividendData();
  }

  // ============ Form Utility Methods ============

  // Reset the form
  resetForm(): void {
    this.searchQuery = '';
    this.selectedStock = null;
    this.quantity = 1;
    this.customPrice = null;
    this.clearSearchResults();
  }

  // Check if form is valid for registration
  isFormValid(): boolean {
    return this.selectedStock !== null && 
           this.quantity >= VALIDATION_CONSTANTS.MIN_QUANTITY && 
           (this.customPrice !== null && this.customPrice >= VALIDATION_CONSTANTS.MIN_PRICE);
  }

  // ============ Display Utility Methods ============

  // Calculate total value for a stock
  getTotalValue(stock: StockData): number {
    return CurrencyUtils.calculateTotalValue(stock.price, stock.quantity);
  }

  // Get month names for dividend calendar
  getMonthNames(): string[] {
    return Object.keys(this.dividendsByMonth);
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string): string {
    return CurrencyUtils.formatCurrency(amount, currency);
  }
}