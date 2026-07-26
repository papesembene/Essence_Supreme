"use client";

import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/mock";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({
  product,
  className = ""
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      disabled={product.stock <= 0}
      className={`inline-flex items-center justify-center gap-2 bg-accent text-primary px-5 py-3 text-sm uppercase tracking-[0.18em] font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ShoppingBag size={18} />
      <span>Ajouter au panier</span>
    </button>
  );
}
