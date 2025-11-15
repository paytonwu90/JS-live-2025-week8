export function formatCurrency(amount) {
  const absAmount = Math.abs(amount).toLocaleString('en-US');
  return amount < 0 ? `-NT$${absAmount}` : `NT$${absAmount}`;
}

export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
}
