"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const FAVORITES_KEY = "essence-supreme-favorites";
const FAVORITES_EVENT = "essence-supreme-favorites-changed";

function getFavoriteCount() {
  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    return saved ? (JSON.parse(saved) as string[]).length : 0;
  } catch {
    return 0;
  }
}

export function FavoriteLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getFavoriteCount());

    updateCount();
    window.addEventListener(FAVORITES_EVENT, updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <Link
      href="/favorites"
      className="relative text-secondary transition-colors hover:text-accent"
      aria-label="Voir les favoris"
      title="Favoris"
    >
      <Heart size={22} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-3 -top-3 h-5 min-w-5 rounded-full bg-accent px-1 text-center text-[11px] font-semibold leading-5 text-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
