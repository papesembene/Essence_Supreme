"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/mock";

interface ProductFiltersProps {
  category?: Category;
  q?: string;
  min?: string;
  max?: string;
  stock: boolean;
  promo: boolean;
  sort: string;
}

export function ProductFilters({
  category,
  q = "",
  min = "",
  max = "",
  stock,
  promo,
  sort,
}: ProductFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  const baseFilters = useMemo(
    () => ({
      category,
      stock,
      promo,
      sort,
    }),
    [category, stock, promo, sort]
  );

  const updateFilters = useCallback(
    (next: {
      q?: string;
      min?: string;
      max?: string;
      stock?: boolean;
      promo?: boolean;
      sort?: string;
    }) => {
      const params = new URLSearchParams();
      const nextSearch = next.q ?? search;
      const nextMin = next.min ?? minPrice;
      const nextMax = next.max ?? maxPrice;
      const nextStock = next.stock ?? baseFilters.stock;
      const nextPromo = next.promo ?? baseFilters.promo;
      const nextSort = next.sort ?? baseFilters.sort;

      if (baseFilters.category) params.set("category", baseFilters.category);
      if (nextSearch.trim()) params.set("q", nextSearch.trim());
      if (nextMin) params.set("min", nextMin);
      if (nextMax) params.set("max", nextMax);
      if (nextStock) params.set("stock", "in");
      if (nextPromo) params.set("promo", "yes");
      if (nextSort && nextSort !== "newest") params.set("sort", nextSort);

      const query = params.toString();
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    },
    [baseFilters, maxPrice, minPrice, router, search]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateFilters({ q: search, min: minPrice, max: maxPrice });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, minPrice, maxPrice, updateFilters]);

  return (
    <div className="mb-14 border-y border-white/5 bg-[#08080C] px-4 py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un produit"
          className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Prix min"
          className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Prix max"
          className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
        />
        <select
          value={sort}
          onChange={(event) => updateFilters({ sort: event.target.value })}
          className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
        >
          <option value="newest">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={stock}
            onChange={(event) => updateFilters({ stock: event.target.checked })}
            className="accent-[#C8A96A]"
          />
          En stock seulement
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={promo}
            onChange={(event) => updateFilters({ promo: event.target.checked })}
            className="accent-[#C8A96A]"
          />
          Promotions seulement
        </label>
      </div>
    </div>
  );
}
