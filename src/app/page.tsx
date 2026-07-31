import { HomeContent } from "@/components/home/HomeContent";
import { mockProducts, Product } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

const removedImageUrls = new Set([
  "/images/products/huiles-rollon-premium.png",
]);

function isDisplayableProduct(product: Product) {
  return Boolean(product.image_url) && !removedImageUrls.has(product.image_url);
}

function mergeWithLocalFallback(products: Product[]) {
  const names = new Set(products.map((product) => product.name));

  return [
    ...products,
    ...mockProducts.filter((product) => !names.has(product.name)),
  ];
}

function selectFeaturedProducts(products: Product[]) {
  const displayableProducts = products.filter(isDisplayableProduct);
  const manuallySelected = products
    .filter((product) => product.is_featured && isDisplayableProduct(product))
    .slice(0, 3);

  if (manuallySelected.length >= 3) return manuallySelected;

  const categories = ["parfum", "deodorant", "brume"] as const;
  const selectedIds = new Set(manuallySelected.map((product) => product.id));
  const selected = categories
    .map((category) =>
      products.find(
        (product) =>
          product.category === category &&
          isDisplayableProduct(product) &&
          !selectedIds.has(product.id)
      )
    )
    .filter((product) => product !== undefined);

  for (const product of selected) {
    selectedIds.add(product.id);
  }

  return [
    ...manuallySelected,
    ...selected,
    ...displayableProducts.filter((product) => !selectedIds.has(product.id)),
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
      products = mergeWithLocalFallback(data as Product[]);
    }
  }

  return <HomeContent featuredProducts={selectFeaturedProducts(products)} />;
}
