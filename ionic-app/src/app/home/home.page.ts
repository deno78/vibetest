import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { StockService, StockData, YahooFinanceData } from '../services/stock.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef;
  
  searchQuery: string = '';
  selectedStock: YahooFinanceData | null = null;
  quantity: number = 1;
  customPrice: number | null = null;
  
  searchResults: YahooFinanceData[] = [];
  registeredStocks: StockData[] = [];
  showSearchResults: boolean = false;
  
  private chart: Chart | null = null;

  constructor(private stockService: StockService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadRegisteredStocks();
  }

  ngAfterViewInit() {
    // Delay chart creation to ensure canvas is properly rendered
    setTimeout(() => {
      this.createPieChart();
    }, 100);
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
      this.resetForm();
    }
  }

  // Load registered stocks from storage
  loadRegisteredStocks() {
    this.registeredStocks = this.stockService.getRegisteredStocks();
    this.updatePieChart();
  }

  // Remove a registered stock
  removeStock(id: string) {
    this.stockService.removeStock(id);
    this.loadRegisteredStocks();
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

  // Create pie chart
  private createPieChart() {
    if (!this.pieChart || !this.pieChart.nativeElement) {
      console.log('Canvas element not available yet');
      return;
    }

    const ctx = this.pieChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('Unable to get canvas context');
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3880ff',
            '#3dc2ff', 
            '#2dd36f',
            '#ffc409',
            '#ff5722',
            '#9c27b0',
            '#673ab7',
            '#607d8b',
            '#795548',
            '#ff9800'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ¥${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    this.updatePieChart();
  }

  // Update pie chart data
  private updatePieChart() {
    if (!this.chart || this.registeredStocks.length === 0) {
      return;
    }

    const chartData = this.registeredStocks.map(stock => ({
      label: `${stock.symbol} (${stock.companyName})`,
      value: this.getTotalValue(stock)
    }));

    this.chart.data.labels = chartData.map(item => item.label);
    this.chart.data.datasets[0].data = chartData.map(item => item.value);
    
    this.chart.update();
  }

  // Clean up chart on component destroy
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}