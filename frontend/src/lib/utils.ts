export function formatPrice(amount: number, currency = "MAD"): string {
  return `${amount.toLocaleString("fr-MA")} ${currency}`;
}

export function getProductPrice(product: {
  base_price: number;
  sale_price?: number;
}): number {
  return product.sale_price ?? product.base_price;
}

export function getPrimaryImage(
  images?: { url: string; is_primary: boolean }[]
): string {
  if (!images?.length) {
    return "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800";
  }
  const primary = images.find((i) => i.is_primary);
  return primary?.url ?? images[0].url;
}

export function cartItemId(productId: string, variantId?: number): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

export function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
