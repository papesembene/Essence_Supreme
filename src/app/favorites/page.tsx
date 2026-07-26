import { FavoritesList } from "@/components/product/FavoritesList";
import { mockProducts, Product } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function FavoritesPage() {
  let products: Product[] = mockProducts;
  const supabase = createServerSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data?.length) {
      products = data as Product[];
    }
  }

  return (
    <div className="container mx-auto min-h-screen px-6 py-16">
      <div className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Sélection privée
        </p>
        <h1 className="font-serif text-3xl tracking-widest sm:text-4xl">
          Mes favoris
        </h1>
      </div>

      <FavoritesList products={products} />
    </div>
  );
}
