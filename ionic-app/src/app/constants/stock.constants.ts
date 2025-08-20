import { DividendData, YahooFinanceData } from '../models/stock.models';

export const STORAGE_KEYS = {
  STOCK_REGISTRATIONS: 'stock_registrations'
} as const;

export const API_ENDPOINTS = {
  YAHOO_FINANCE_SEARCH: '/api/yahoo/v1/finance/search',
  FINANCIAL_MODELING_PREP: 'https://financialmodelingprep.com/api/v3/search'
} as const;

export const SEARCH_CONFIG = {
  QUOTES_COUNT: '10',
  NEWS_COUNT: '0',
  LIMIT: '10',
  DEMO_API_KEY: 'demo'
} as const;

export const CURRENCY_TYPES = {
  JPY: 'JPY',
  USD: 'USD'
} as const;

export const MOCK_DIVIDEND_DATA: DividendData[] = [
  // AAPL quarterly dividends
  { symbol: 'AAPL', exDate: new Date('2025-11-08'), paymentDate: new Date('2025-11-14'), amount: 0.24, currency: 'USD' },
  { symbol: 'AAPL', exDate: new Date('2026-02-07'), paymentDate: new Date('2026-02-13'), amount: 0.25, currency: 'USD' },
  { symbol: 'AAPL', exDate: new Date('2026-05-09'), paymentDate: new Date('2026-05-15'), amount: 0.25, currency: 'USD' },
  { symbol: 'AAPL', exDate: new Date('2026-08-08'), paymentDate: new Date('2026-08-14'), amount: 0.26, currency: 'USD' },
  // GOOGL quarterly dividends  
  { symbol: 'GOOGL', exDate: new Date('2025-12-13'), paymentDate: new Date('2025-12-19'), amount: 0.20, currency: 'USD' },
  { symbol: 'GOOGL', exDate: new Date('2026-03-14'), paymentDate: new Date('2026-03-20'), amount: 0.21, currency: 'USD' },
  { symbol: 'GOOGL', exDate: new Date('2026-06-13'), paymentDate: new Date('2026-06-19'), amount: 0.21, currency: 'USD' },
  { symbol: 'GOOGL', exDate: new Date('2026-09-12'), paymentDate: new Date('2026-09-18'), amount: 0.22, currency: 'USD' },
  // MSFT quarterly dividends
  { symbol: 'MSFT', exDate: new Date('2025-11-20'), paymentDate: new Date('2025-12-12'), amount: 0.75, currency: 'USD' },
  { symbol: 'MSFT', exDate: new Date('2026-02-19'), paymentDate: new Date('2026-03-12'), amount: 0.78, currency: 'USD' },
  { symbol: 'MSFT', exDate: new Date('2026-05-21'), paymentDate: new Date('2026-06-11'), amount: 0.78, currency: 'USD' },
  { symbol: 'MSFT', exDate: new Date('2026-08-20'), paymentDate: new Date('2026-09-10'), amount: 0.80, currency: 'USD' },
  // Japanese stocks - semi-annual dividends
  { symbol: '7203.T', exDate: new Date('2026-03-28'), paymentDate: new Date('2026-06-27'), amount: 75, currency: 'JPY' },
  { symbol: '7203.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 75, currency: 'JPY' },
  { symbol: '6758.T', exDate: new Date('2026-03-30'), paymentDate: new Date('2026-06-27'), amount: 45, currency: 'JPY' },
  { symbol: '6758.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 45, currency: 'JPY' },
  { symbol: '9984.T', exDate: new Date('2026-03-30'), paymentDate: new Date('2026-06-27'), amount: 55, currency: 'JPY' },
  { symbol: '9984.T', exDate: new Date('2026-09-30'), paymentDate: new Date('2026-12-05'), amount: 55, currency: 'JPY' }
];

export const MOCK_STOCK_DATA: YahooFinanceData[] = [
  { symbol: 'AAPL', shortName: 'Apple Inc.', regularMarketPrice: 189.79 },
  { symbol: '7203.T', shortName: 'Toyota Motor Corporation', regularMarketPrice: 2891 },
  { symbol: '6758.T', shortName: 'Sony Group Corporation', regularMarketPrice: 13540 },
  { symbol: '9984.T', shortName: 'SoftBank Group Corp.', regularMarketPrice: 7342 },
  { symbol: 'GOOGL', shortName: 'Alphabet Inc.', regularMarketPrice: 159.40 },
  { symbol: 'MSFT', shortName: 'Microsoft Corporation', regularMarketPrice: 416.06 },
  { symbol: 'TSLA', shortName: 'Tesla, Inc.', regularMarketPrice: 249.83 }
];