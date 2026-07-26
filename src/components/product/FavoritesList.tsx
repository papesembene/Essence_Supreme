"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/mock";
import { ProductCard } from "@/components/product/ProductCard";

const FAVORITES_KEY = "essence-supreme-favorites";
const FAVORITES_EVENT = "essence-supreme-favorites-changed";

function readFavorites() {
  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesList({ products }: { products: Product[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const updateFavorites = () => setFavoriteIds(readFavorites());

    updateFavorites();
    window.addEventListener(FAVORITES_EVENT, updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  const favorites = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, products]
  );

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <p className="mb-6 text-muted">
          Aucun favori pour le moment. Appuyez sur le coeur d&apos;un produit
          pour le garder ici.
        </p>
        <Link
          href="/products"
          className="inline-flex bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-white"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
