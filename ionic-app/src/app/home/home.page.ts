import { Component, OnInit } from '@angular/core';
import { StockService, StockData, YahooFinanceData, DividendCalendarItem } from '../services/stock.service';

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
  totalUpcomingDividends: { jpy: number, usd: number } = { jpy: 0, usd: 0 };
  dividendsByMonth: { [month: string]: DividendCalendarItem[] } = {};

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadRegisteredStocks();
    this.loadDividendData();
  }

  // Search for stocks using the service
  onSearchInput() {
    if (this.searchQuery.trim().length > 0) {
      this.stockService.searchStock(this.searchQuery).subscribe(
        results => {
          this.searchResults = results;
          this.showSearchResults = results.length > 0;
        }
      );
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }

  // Select a stock from search results
  selectStock(stock: YahooFinanceData) {
    this.selectedStock = stock;
    this.searchQuery = `${stock.symbol} - ${stock.shortName}`;
    this.customPrice = stock.regularMarketPrice || null;
    this.showSearchResults = false;
  }

  // Register the selected stock
  registerStock() {
    if (this.selectedStock && this.quantity > 0) {
      const stockData = {
        symbol: this.selectedStock.symbol,
        companyName: this.selectedStock.shortName,
        price: this.customPrice || this.selectedStock.regularMarketPrice || 0,
        quantity: this.quantity
      };

      this.stockService.registerStock(stockData);
      this.loadRegisteredStocks();
      this.loadDividendData(); // Refresh dividend data when stocks change
      this.resetForm();
    }
  }

  // Load registered stocks from storage
  loadRegisteredStocks() {
    this.registeredStocks = this.stockService.getRegisteredStocks();
  }

  // Load dividend data
  loadDividendData() {
    this.upcomingDividends = this.stockService.getUpcomingDividends();
    this.totalUpcomingDividends = this.stockService.getTotalUpcomingDividends();
    this.dividendsByMonth = this.stockService.getDividendsByMonth();
  }

  // Remove a registered stock
  removeStock(id: string) {
    this.stockService.removeStock(id);
    this.loadRegisteredStocks();
    this.loadDividendData(); // Refresh dividend data when stocks change
  }

  // Reset the form
  resetForm() {
    this.searchQuery = '';
    this.selectedStock = null;
    this.quantity = 1;
    this.customPrice = null;
    this.searchResults = [];
    this.showSearchResults = false;
  }

  // Check if form is valid for registration
  isFormValid(): boolean {
    return this.selectedStock !== null && this.quantity > 0 && (this.customPrice !== null && this.customPrice > 0);
  }

  // Calculate total value for a stock
  getTotalValue(stock: StockData): number {
    return stock.price * stock.quantity;
  }

  // Get month names for dividend calendar
  getMonthNames(): string[] {
    return Object.keys(this.dividendsByMonth);
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string): string {
    if (currency === 'JPY') {
      return `¥${amount.toLocaleString('ja-JP')}`;
    } else if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)} ${currency}`;
  }
}