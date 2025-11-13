export function formatCurrency(amount) {
  const absAmount = Math.abs(amount).toLocaleString('en-US');
  return amount < 0 ? `-NT$${absAmount}` : `NT$${absAmount}`;
}
