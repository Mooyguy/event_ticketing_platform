export function formatCurrency(value, locale = "en-CA", currency = "CAD") {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}