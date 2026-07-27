import { Product, mockProducts } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type ProductRecord = Product & {
  compare_at_price?: number | string | null;
  price: number | string;
};

function normalizeProduct(product: ProductRecord): Product {
  return {
    ...product,
    price: Number(product.price),
    compare_at_price:
      product.compare_at_price === null || product.compare_at_price === undefined
        ? null
        : Number(product.compare_at_price),
    seller_name: product.seller_name || "Essence Suprême",
    seller_whatsapp: product.seller_whatsapp || "221781157773"
  };
}

export async function GET() {
  const supabase = createServerSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(80);

    if (data?.length) {
      return Response.json({
        products: (data as ProductRecord[]).map(normalizeProduct)
      });
    }
  }

  return Response.json({
    products: mockProducts.filter((product) => product.stock > 0).slice(0, 80)
  });
}
