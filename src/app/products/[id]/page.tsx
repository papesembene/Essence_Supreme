import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockProducts, Product } from "@/lib/mock";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
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
    <div className="flex-grow flex flex-col md:flex-row min-h-[calc(100vh-100px)]">
      {/* Image plein écran (Gauche) */}
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-full bg-[#0A0A0E]">
        <Link href="/products" className="absolute top-8 left-8 z-20 text-white hover:text-accent transition-colors flex items-center space-x-2 bg-black/20 p-2 rounded-full backdrop-blur-md">
          <ArrowLeft size={20} />
        </Link>
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden" />
      </div>

      {/* Contenu textuel (Droite) */}
      <div className="w-full md:w-1/2 flex items-center bg-primary">
        <div className="px-8 py-16 md:px-16 lg:px-24 max-w-2xl">
          <p className="text-accent uppercase tracking-widest text-sm mb-4">{product.category}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 tracking-wide">{product.name}</h1>
          <div className="mb-10">
            {discount && (
              <div className="mb-3 flex items-center gap-3">
                <span className="text-muted line-through">
                  {formatPrice(product.compare_at_price || 0)}
                </span>
                <span className="bg-red-500/15 text-red-300 px-3 py-1 text-xs font-semibold tracking-widest">
                  -{discount}%
                </span>
              </div>
            )}
            <p className="text-secondary text-2xl tracking-widest font-light">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <div className="h-px w-full bg-white/10 mb-10" />
          
          <p className="text-muted font-light leading-relaxed mb-12 text-lg">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={orderProduct} className="w-full sm:w-auto" />
            <a 
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center w-full sm:w-auto border border-white/10 px-10 py-5 uppercase tracking-widest font-semibold hover:border-accent hover:text-accent transition-colors duration-300 overflow-hidden"
            >
              <span className="relative z-10">WhatsApp direct</span>
            </a>
          </div>
          
          <div className="mt-12 space-y-4 text-sm text-muted font-light">
            <p className="flex items-center">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"} mr-3`} />
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock temporaire"}
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-3" />
              Livraison premium avec signature et coffret inclus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
