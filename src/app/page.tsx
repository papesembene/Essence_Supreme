import { HomeContent } from "@/components/home/HomeContent";
import { mockProducts, Product } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

function selectFeaturedProducts(products: Product[]) {
  const categories = ["parfum", "deodorant", "brume"] as const;
  const selected = categories
    .map((category) => products.find((product) => product.category === category))
    .filter((product) => product !== undefined);

  if (selected.length >= 3) return selected;

  const selectedIds = new Set(selected.map((product) => product.id));
  return [
    ...selected,
    ...products.filter((product) => !selectedIds.has(product.id)),
  ].slice(0, 3);
}

export default async function Home() {
  let products = mockProducts;
  const supabase = createServerSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(24);

    if (data?.length) {
      products = data as Product[];
    }
  }

  return <HomeContent featuredProducts={selectFeaturedProducts(products)} />;
}
