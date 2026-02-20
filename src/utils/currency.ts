export function formatCurrency(amount: number, currency: '$' = '$'): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

export function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}
