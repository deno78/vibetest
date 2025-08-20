import { Injectable } from '@angular/core';
import { DividendCalendarItem, DividendTotals, StockData } from '../models';
import { MOCK_DIVIDEND_DATA, CURRENCY_TYPES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DividendService {

  /**
   * Get upcoming dividends for the next 12 months for registered stocks
   */
  getUpcomingDividends(registeredStocks: StockData[]): DividendCalendarItem[] {
    const now = new Date();
    const twelveMonthsFromNow = new Date();
    twelveMonthsFromNow.setFullYear(now.getFullYear() + 1);

    const upcomingDividends: DividendCalendarItem[] = [];

    registeredStocks.forEach(stock => {
      const stockDividends = MOCK_DIVIDEND_DATA.filter(dividend => 
        dividend.symbol === stock.symbol &&
        dividend.paymentDate >= now &&
        dividend.paymentDate <= twelveMonthsFromNow
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

  /**
   * Calculate total expected dividends for next 12 months
   */
  getTotalUpcomingDividends(upcomingDividends: DividendCalendarItem[]): DividendTotals {
    let totalJPY = 0;
    let totalUSD = 0;

    upcomingDividends.forEach(item => {
      if (item.dividend.currency === CURRENCY_TYPES.JPY) {
        totalJPY += item.totalDividend;
      } else if (item.dividend.currency === CURRENCY_TYPES.USD) {
        totalUSD += item.totalDividend;
      }
    });

    return { jpy: totalJPY, usd: totalUSD };
  }

  /**
   * Group dividends by month for calendar/chart view
   */
  getDividendsByMonth(upcomingDividends: DividendCalendarItem[]): { [month: string]: DividendCalendarItem[] } {
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
}