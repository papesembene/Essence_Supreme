import { HomeContent } from "@/components/home/HomeContent";
import { mockProducts, Product } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const removedImageUrls = new Set([
  "/images/products/huiles-rollon-premium.png",
  "/huiles/extrait-20ml-hugo-boss-2500.jpeg",
  "/huiles/extrait-20ml-kayali-81-2500.jpeg",
  "/huiles/extrait-20ml-scandale-2500.jpeg",
]);

function isDisplayableProduct(product: Product) {
  return Boolean(product.image_url) && !removedImageUrls.has(product.image_url);
}

function mergeWithLocalFallback(products: Product[]) {
  const localByName = new Map(
    mockProducts.map((product) => [product.name, product])
  );
  const normalizedProducts = products.map((product) => {
    const localProduct = localByName.get(product.name);

    if (localProduct && !isDisplayableProduct(product)) {
      return {
        ...localProduct,
        id: product.id,
        admin_id: product.admin_id,
        seller_name: product.seller_name,
        seller_whatsapp: product.seller_whatsapp,
        stock: product.stock,
        created_at: product.created_at,
        is_featured: product.is_featured,
      };
    }

    return product;
  });
  const names = new Set(normalizedProducts.map((product) => product.name));

  return [
    ...normalizedProducts,
    ...mockProducts.filter((product) => !names.has(product.name)),
  ];
}

function selectCategoryImages(products: Product[]) {
  const displayableProducts = products.filter(isDisplayableProduct);

  return {
    parfum:
      displayableProducts.find((product) => product.category === "parfum")
        ?.image_url || "/parfums/parfum-4000-1.jpeg",
    huile:
      displayableProducts.find((product) => product.category === "huile")
        ?.image_url || "/huiles/kim-k-huile-5ml-1000.jpeg",
    deodorant:
      displayableProducts.find((product) => product.category === "deodorant")
        ?.image_url || "/deo/deo-1.jpeg",
    brume:
      displayableProducts.find((product) => product.category === "brume")
        ?.image_url || "/brumes/brume-vv-love-1.jpeg",
  };
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
      .limit(80);

    if (data?.length) {
      products = mergeWithLocalFallback(data as Product[]);
    }
  }

  return (
    <HomeContent
      featuredProducts={selectFeaturedProducts(products)}
      categoryImages={selectCategoryImages(products)}
    />
  );
}
