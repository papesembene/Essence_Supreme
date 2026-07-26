import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockProducts, Product } from "@/lib/mock";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ProductCard } from "@/components/product/ProductCard";
import { buildSingleProductMessage, whatsappUrl } from "@/lib/whatsapp";
import { discountPercent, formatPrice } from "@/lib/pricing";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  let product: Product | undefined = mockProducts.find((p: Product) => p.id === id);
  const supabase = createServerSupabase();
  if (supabase && id.length > 20 && !id.startsWith("starter-")) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) product = data as Product;
  }

  if (!product) {
    notFound();
  }

  let similarProducts = mockProducts
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 3);

  if (supabase) {
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .gt("stock", 0)
      .limit(3);

    if (relatedData?.length) {
      similarProducts = relatedData as Product[];
    }
  }

  const sellerName = product.seller_name || "Essence Suprême";
  const sellerWhatsapp = product.seller_whatsapp || "212600000000";
  const orderProduct = {
    ...product,
    seller_name: sellerName,
    seller_whatsapp: sellerWhatsapp
  };
  const discount = discountPercent(product.price, product.compare_at_price);

  const directWhatsappUrl = whatsappUrl(
    sellerWhatsapp,
    buildSingleProductMessage(orderProduct)
  );

  return (
    <div className="flex-grow bg-primary">
      <section className="flex min-h-[calc(100vh-150px)] flex-col lg:flex-row">
        <div className="relative min-h-[46vh] w-full bg-[#0A0A0E] lg:w-1/2 lg:min-h-full">
          <Link href="/products" className="absolute left-5 top-5 z-20 flex items-center space-x-2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-colors hover:text-accent sm:left-8 sm:top-8">
            <ArrowLeft size={20} />
          </Link>
          <FavoriteButton productId={product.id} className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8" />
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent lg:hidden" />
        </div>

        <div className="flex w-full items-center bg-primary lg:w-1/2">
          <div className="max-w-2xl px-6 py-12 sm:px-8 md:px-14 lg:px-16 xl:px-20">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">{product.category}</p>
            <h1 className="mb-5 font-serif text-3xl tracking-wide sm:text-4xl lg:text-5xl">{product.name}</h1>
            <div className="mb-8">
              {discount && (
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-muted line-through">
                    {formatPrice(product.compare_at_price || 0)}
                  </span>
                  <span className="bg-red-500/15 px-3 py-1 text-xs font-semibold tracking-widest text-red-300">
                    -{discount}%
                  </span>
                </div>
              )}
              <p className="text-xl font-light tracking-widest text-secondary sm:text-2xl">
                {formatPrice(product.price)}
              </p>
            </div>
            
            <div className="mb-8 h-px w-full bg-white/10" />
            
            <p className="mb-10 text-base font-light leading-relaxed text-muted sm:text-lg">
              {product.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={orderProduct} className="w-full sm:w-auto" />
              <a 
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 hover:border-accent hover:text-accent sm:w-auto"
              >
                WhatsApp direct
              </a>
            </div>
            
            <div className="mt-10 space-y-4 text-sm font-light text-muted">
              <p className="flex items-center">
                <span className={`mr-3 h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock temporaire"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="border-t border-white/5 px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  À découvrir aussi
                </p>
                <h2 className="font-serif text-2xl tracking-widest sm:text-3xl">
                  Produits similaires
                </h2>
              </div>
              <Link href={`/products?category=${product.category}`} className="text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:text-white">
                Voir la catégorie
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
