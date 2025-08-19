/**
 * Utility functions for currency formatting and display
 */

export class CurrencyUtils {
  /**
   * Format currency amount for display
   * @param amount The amount to format
   * @param currency The currency code (JPY, USD, etc.)
   * @returns Formatted currency string
   */
  static formatCurrency(amount: number, currency: string): string {
    if (currency === 'JPY') {
      return `¥${amount.toLocaleString('ja-JP')}`;
    } else if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Calculate total value for a position
   * @param price Price per unit
   * @param quantity Number of units
   * @returns Total value
   */
  static calculateTotalValue(price: number, quantity: number): number {
    return price * quantity;
  }
}