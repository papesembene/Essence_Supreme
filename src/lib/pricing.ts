export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-SN", {
    maximumFractionDigits: 0
  }).format(value) + " FCFA";
}

export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
