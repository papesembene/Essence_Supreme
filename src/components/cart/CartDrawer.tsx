"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { CartItem } from "@/components/cart/CartProvider";
import { useCart } from "@/components/cart/CartProvider";
import { buildCartMessage, whatsappUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/pricing";
import { createClient } from "@/lib/supabase";

export const OPEN_CART_EVENT = "essence-supreme-open-cart";
const PROMO_RATE = 0.05;
const ROUND_PRICE_PROMO_DELTA = 80;
const ROUND_PRICE_PROMO_PRICES = new Set([1580, 2580, 3080, 4080]);

function calculatePromoDiscount(items: CartItem[]) {
  return items.reduce((discount, item) => {
    const itemTotal = item.product.price * item.quantity;

    if (ROUND_PRICE_PROMO_PRICES.has(item.product.price)) {
      return discount + ROUND_PRICE_PROMO_DELTA * item.quantity;
    }

    return discount + Math.round(itemTotal * PROMO_RATE);
  }, 0);
}

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState("");
  const { items, count, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const openCart = () => setOpen(true);

    window.addEventListener(OPEN_CART_EVENT, openCart);
    return () => window.removeEventListener(OPEN_CART_EVENT, openCart);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const groups = useMemo(() => {
    const grouped = new Map<
      string,
      {
        sellerName: string;
        sellerWhatsapp: string;
        items: typeof items;
      }
    >();

    for (const item of items) {
      const key = item.product.seller_whatsapp;
      const existing = grouped.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        grouped.set(key, {
          sellerName: item.product.seller_name,
          sellerWhatsapp: item.product.seller_whatsapp,
          items: [item]
        });
      }
    }

    return Array.from(grouped.values());
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const normalizedPromoCode = promoCode.trim().toUpperCase();
  const promoIsValid = normalizedPromoCode === "AOUT26";
  const discountAmount = promoIsValid ? calculatePromoDiscount(items) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = async (group: (typeof groups)[number]) => {
    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedAddress = customerAddress.trim();

    if (!trimmedName) {
      setCheckoutError("Ajoutez votre nom avant WhatsApp.");
      return;
    }

    if (normalizedPromoCode && !promoIsValid) {
      setCheckoutError("Ce code promo n'est pas reconnu.");
      return;
    }

    setCheckoutError("");
    const groupSubtotal = group.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const groupDiscountAmount = promoIsValid
      ? calculatePromoDiscount(group.items)
      : 0;
    const message = buildCartMessage(group.items, {
      name: trimmedName,
      phone: trimmedPhone,
      address: trimmedAddress,
      promoCode: promoIsValid ? normalizedPromoCode : undefined,
      discountAmount: groupDiscountAmount,
    });
    const url = whatsappUrl(group.sellerWhatsapp, message);
    const popup = window.open("", "_blank");
    setCheckoutLoading(group.sellerWhatsapp);

    try {
      const supabase = createClient();
      await supabase.from("orders").insert({
        admin_id: group.items[0]?.product.admin_id || null,
        customer_name: trimmedName,
        customer_phone: trimmedPhone || null,
        customer_address: trimmedAddress || null,
        items: group.items.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
        total: Math.max(0, groupSubtotal - groupDiscountAmount),
      });
    } finally {
      setCheckoutLoading("");
      if (popup) {
        popup.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative text-secondary hover:text-accent transition-colors"
        aria-label="Ouvrir le panier"
      >
        <ShoppingBag size={22} strokeWidth={1.5} />
        {count > 0 && (
          <span className="absolute -right-3 -top-3 min-w-5 h-5 rounded-full bg-accent px-1 text-[11px] leading-5 text-primary font-semibold text-center">
            {count}
          </span>
        )}
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[9999]">
          <button
            type="button"
            aria-label="Fermer le panier"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 h-dvh w-full max-w-md bg-primary border-l border-white/10 shadow-2xl flex flex-col">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-6 py-5">
              <h2 className="font-serif text-2xl tracking-widest">PANIER</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-accent transition-colors"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-8 text-center text-muted font-light">
                Votre panier est vide.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4">
                      <div className="relative h-24 w-20 flex-shrink-0 bg-[#0A0A0E] border border-white/5">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif tracking-wide truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-accent mt-2">
                          {formatPrice(product.price * quantity)}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            className="h-8 w-8 border border-white/10 grid place-items-center hover:border-accent transition-colors"
                            aria-label="Diminuer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            className="h-8 w-8 border border-white/10 grid place-items-center hover:border-accent transition-colors"
                            aria-label="Augmenter"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="ml-auto p-2 text-muted hover:text-red-400 transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-shrink-0 border-t border-white/10 p-5 sm:p-6 space-y-4 bg-primary">
                  <div className="grid grid-cols-1 gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      Vos informations
                    </p>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nom et prénom *"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Téléphone (optionnel)"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Adresse de livraison (optionnel)"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code promo (ex: AOUT26)"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm uppercase focus:border-accent outline-none"
                    />
                    {promoIsValid && (
                      <p className="text-sm text-green-300">
                        Code AOUT26 appliqué: -5%
                      </p>
                    )}
                    {checkoutError && (
                      <p className="text-sm text-red-300">{checkoutError}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm uppercase tracking-widest">
                    <div className="flex justify-between">
                      <span className="text-muted">Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-300">
                        <span>Remise</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-muted">Total</span>
                      <span className="text-accent">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {groups.map((group, index) => (
                    <button
                      key={group.sellerWhatsapp}
                      type="button"
                      onClick={() => handleCheckout(group)}
                      disabled={checkoutLoading === group.sellerWhatsapp}
                      className="block w-full bg-accent text-primary px-4 py-3 text-center text-sm uppercase tracking-[0.18em] font-semibold hover:bg-white transition-colors disabled:opacity-60"
                    >
                      {checkoutLoading === group.sellerWhatsapp
                        ? "Ouverture..."
                        : groups.length > 1
                        ? `Valider commande ${index + 1}`
                        : "Valider cette commande"}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full border border-white/10 px-4 py-3 text-sm uppercase tracking-widest text-muted hover:border-white hover:text-white transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
