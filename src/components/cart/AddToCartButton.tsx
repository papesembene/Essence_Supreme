"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { mockProducts, Product } from "@/lib/mock";
import { useCart } from "@/components/cart/CartProvider";
import { OPEN_CART_EVENT } from "@/components/cart/CartDrawer";
import { formatPrice } from "@/lib/pricing";

export function AddToCartButton({
  product,
  className = ""
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const sameCategory = mockProducts.filter(
      (item) => item.id !== product.id && item.category === product.category && item.stock > 0
    );
    const fallback = mockProducts.filter(
      (item) => item.id !== product.id && item.category !== product.category && item.stock > 0
    );

    return [...sameCategory, ...fallback].slice(0, 3);
  }, [product.category, product.id]);

  const handleAdd = () => {
    addItem(product);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className={`inline-flex items-center justify-center gap-2 bg-accent text-primary px-5 py-3 text-sm uppercase tracking-[0.18em] font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <ShoppingBag size={18} />
        <span>Ajouter au panier</span>
      </button>

      {typeof document !== "undefined" && showSuggestions && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 px-4 py-5 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-2xl border border-white/10 bg-primary shadow-2xl">
            <div className="flex items-start justify-between gap-5 border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Produit ajouté
                </p>
                <h2 className="mt-2 font-serif text-2xl tracking-widest">
                  Compléter votre panier ?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="p-2 text-muted transition-colors hover:text-accent"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-white/10 bg-[#08080C]">
                  <Link
                    href={`/products/${suggestion.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="relative block aspect-[4/3] bg-[#0A0A0E]"
                  >
                    <Image
                      src={suggestion.image_url}
                      alt={suggestion.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 220px"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="truncate font-serif text-base tracking-wide">
                      {suggestion.name}
                    </h3>
                    <p className="mt-2 text-sm text-accent">
                      {formatPrice(suggestion.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addItem(suggestion)}
                      className="mt-4 w-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="border border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-white hover:text-white"
              >
                Continuer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuggestions(false);
                  window.dispatchEvent(new Event(OPEN_CART_EVENT));
                }}
                className="inline-flex items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-white"
              >
                Voir le panier
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
