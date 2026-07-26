"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/mock";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { discountPercent, formatPrice } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const orderProduct = {
    ...product,
    seller_name: product.seller_name || "Essence Suprême",
    seller_whatsapp: product.seller_whatsapp || "212600000000"
  };
  const discount = discountPercent(product.price, product.compare_at_price);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "tween", duration: 0.3 }}
      className="group flex flex-col h-full"
    >
      <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-[#0A0A0E]">
        <Link href={`/products/${product.id}`} className="absolute inset-0">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        <FavoriteButton productId={product.id} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mt-auto">
        <div className="min-w-0">
          <h3 className="font-serif text-lg tracking-wide mb-1 group-hover:text-accent transition-colors">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-muted text-sm font-light capitalize">{product.category}</p>
        </div>
        <div className="text-left sm:text-right sm:whitespace-nowrap">
          {discount && (
            <div className="mb-1 flex items-center justify-end gap-2">
              <span className="text-xs text-muted line-through">
                {formatPrice(product.compare_at_price || 0)}
              </span>
              <span className="bg-red-500/15 text-red-300 px-2 py-1 text-[11px] font-semibold">
                -{discount}%
              </span>
            </div>
          )}
          <div className="text-secondary tracking-widest font-light">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
      <AddToCartButton product={orderProduct} className="mt-5 w-full text-xs py-3" />
    </motion.div>
  );
}
