"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const FAVORITES_KEY = "essence-supreme-favorites";
const FAVORITES_EVENT = "essence-supreme-favorites-changed";

function readFavorites() {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({
  productId,
  className = ""
}: {
  productId: string;
  className?: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(readFavorites().includes(productId));
  }, [productId]);

  const toggleFavorite = () => {
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    setIsFavorite(nextFavorites.includes(productId));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-primary/75 text-secondary backdrop-blur-md transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
