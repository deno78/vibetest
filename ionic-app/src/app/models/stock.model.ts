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