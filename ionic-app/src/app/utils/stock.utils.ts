import { CURRENCY_TYPES } from '../constants';

/**
 * Generate a unique ID using timestamp and random string
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format currency amount for display
 * @param amount - The amount to format
 * @param currency - Currency code (JPY, USD, etc.)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string): string {
  if (currency === CURRENCY_TYPES.JPY) {
    return `¥${amount.toLocaleString('ja-JP')}`;
  } else if (currency === CURRENCY_TYPES.USD) {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Calculate total value of a stock position
 * @param price - Stock price
 * @param quantity - Number of shares
 * @returns Total value
 */
export function calculateTotalValue(price: number, quantity: number): number {
  return price * quantity;
}

/**
 * Validate if search query is not empty
 * @param query - Search query string
 * @returns True if query is valid
 */
export function isValidSearchQuery(query: string): boolean {
  return !!query && query.trim().length > 0;
}

/**
 * Filter search results based on query
 * @param items - Array of items to search
 * @param query - Search query
 * @param searchFields - Fields to search in
 * @returns Filtered items
 */
export function filterByQuery<T>(
  items: T[], 
  query: string, 
  searchFields: (keyof T)[]
): T[] {
  const searchTerm = query.toLowerCase();
  return items.filter(item => 
    searchFields.some(field => 
      String(item[field]).toLowerCase().includes(searchTerm)
    )
  );
}

/**
 * Validate form data for stock registration
 * @param selectedStock - Selected stock data
 * @param quantity - Quantity value
 * @param customPrice - Custom price value
 * @returns True if form is valid
 */
export function isStockFormValid(
  selectedStock: any, 
  quantity: number, 
  customPrice: number | null
): boolean {
  return selectedStock !== null && 
         quantity > 0 && 
         customPrice !== null && 
         customPrice > 0;
}