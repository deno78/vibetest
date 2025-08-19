import { StockData } from './stock.model';

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

export interface DividendTotals {
  jpy: number;
  usd: number;
}