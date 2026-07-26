import { HomeContent } from "@/components/home/HomeContent";
import { mockProducts, Product } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

function selectFeaturedProducts(products: Product[]) {
  const manuallySelected = products
    .filter((product) => product.is_featured)
    .slice(0, 3);

  if (manuallySelected.length >= 3) return manuallySelected;

  const categories = ["parfum", "deodorant", "brume"] as const;
  const selectedIds = new Set(manuallySelected.map((product) => product.id));
  const selected = categories
    .map((category) =>
      products.find(
        (product) =>
          product.category === category && !selectedIds.has(product.id)
      )
    )
    .filter((product) => product !== undefined);

  for (const product of selected) {
    selectedIds.add(product.id);
  }

  return [
    ...manuallySelected,
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
