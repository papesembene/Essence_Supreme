import Link from "next/link";
import { Tag } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="border-b border-accent/20 bg-accent/10 px-4 py-3 text-center">
      <Link
        href="/products"
        className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white"
      >
        <Tag size={15} />
        <span>-10% sur votre commande avec le code: AOUT26</span>
      </Link>
    </div>
  );
}
