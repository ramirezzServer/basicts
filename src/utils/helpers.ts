export function sanitizeText(text: string): string {
  return typeof text === 'string' ? text.replace(/[<>]/g, '') : '';
}

export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && !isNaN(price) && price > 0 && price < 100000;
}

export function isValidCurrency(currency: string): boolean {
  return ['BTC', 'ETH', 'LTC', 'XRP'].includes(currency);
}
