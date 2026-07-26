import { Product } from "@/lib/mock";
import { formatPrice } from "@/lib/pricing";

export function normalizeWhatsappNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function buildSingleProductMessage(product: Product) {
  return [
    "Bonjour, je souhaite commander :",
    "",
    `Produit: ${product.name}`,
    `Prix: ${formatPrice(product.price)}`,
    "",
    "Merci de m'indiquer la démarche à suivre."
  ].join("\n");
}

export function buildCartMessage(
  items: Array<{ product: Product; quantity: number }>,
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    promoCode?: string;
    discountAmount?: number;
  }
) {
  const lines = items.map(({ product, quantity }, index) => {
    const total = product.price * quantity;
    return `${index + 1}. ${product.name} x${quantity} - ${formatPrice(total)}`;
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = customer?.discountAmount || 0;
  const total = Math.max(0, subtotal - discountAmount);

  return [
    "Bonjour, je souhaite valider cette commande :",
    "",
    customer?.name ? `Client: ${customer.name}` : null,
    customer?.phone ? `Téléphone: ${customer.phone}` : null,
    customer?.address ? `Adresse: ${customer.address}` : null,
    "",
    ...lines,
    "",
    customer?.promoCode && discountAmount > 0
      ? `Sous-total: ${formatPrice(subtotal)}`
      : null,
    customer?.promoCode && discountAmount > 0
      ? `Code promo: ${customer.promoCode} (-${formatPrice(discountAmount)})`
      : null,
    `Total: ${formatPrice(total)}`,
    "",
    "Merci de me confirmer la disponibilité et la livraison."
  ]
    .filter(Boolean)
    .join("\n");
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
