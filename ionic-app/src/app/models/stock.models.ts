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
  longName?: string;
  regularMarketPrice?: number | null;
  currency?: string;
  marketState?: string;
  fullExchangeName?: string;
  displayName?: string;
}

export interface YahooFinanceSearchResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  typeDisp?: string;
  quoteType?: string;
}

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