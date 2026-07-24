"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { buildCartMessage, whatsappUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/pricing";
import { createClient } from "@/lib/supabase";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState("");
  const { items, count, removeItem, updateQuantity, clearCart } = useCart();

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

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async (group: (typeof groups)[number]) => {
    const message = buildCartMessage(group.sellerName, group.items);
    const url = whatsappUrl(group.sellerWhatsapp, message);
    const popup = window.open("", "_blank");
    setCheckoutLoading(group.sellerWhatsapp);

    try {
      const supabase = createClient();
      await supabase.from("orders").insert({
        admin_id: group.items[0]?.product.admin_id || null,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        customer_address: customerAddress || null,
        items: group.items.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
        total: group.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
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

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Fermer le panier"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-primary border-l border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
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
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
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

                <div className="border-t border-white/10 p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nom du client"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Téléphone"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Adresse de livraison"
                      className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
                    />
                  </div>

                  <div className="flex justify-between text-sm uppercase tracking-widest">
                    <span className="text-muted">Total</span>
                    <span className="text-accent">{formatPrice(total)}</span>
                  </div>

                  {groups.map((group, index) => (
                    <button
                      key={group.sellerWhatsapp}
                      type="button"
                      onClick={() => handleCheckout(group)}
                      disabled={checkoutLoading === group.sellerWhatsapp}
                      className="block w-full bg-accent text-primary px-4 py-4 text-center uppercase tracking-widest font-semibold hover:bg-white transition-colors"
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
        </div>
      )}
    </>
  );
}
