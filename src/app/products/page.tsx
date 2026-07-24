import { ProductCard } from "@/components/product/ProductCard";
import { mockProducts, Category, Product } from "@/lib/mock";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    q?: string;
    min?: string;
    max?: string;
    stock?: string;
    promo?: string;
    sort?: string;
  }>;
}

const PAGE_SIZE = 6;
const categories: Array<{ value?: Category; label: string; href: string }> = [
  { label: "Tout", href: "/products" },
  { value: "parfum", label: "Parfums", href: "/products?category=parfum" },
  { value: "huile", label: "Huiles", href: "/products?category=huile" },
  { value: "deodorant", label: "Déodorants", href: "/products?category=deodorant" },
  { value: "brume", label: "Brumes", href: "/products?category=brume" },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categoryFilter = params.category as Category | undefined;
  const query = (params.q || "").trim().toLowerCase();
  const minPrice = params.min ? Number(params.min) : null;
  const maxPrice = params.max ? Number(params.max) : null;
  const stockFilter = params.stock === "in";
  const promoFilter = params.promo === "yes";
  const sort = params.sort || "newest";
  const requestedPage = Number(params.page ?? "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  
  let productsList: Product[] = mockProducts;
  const supabase = createServerSupabase();
  if (supabase) {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      productsList = data as Product[];
    }
  }

  const filteredProducts = productsList
    .filter((p: Product) => !categoryFilter || p.category === categoryFilter)
    .filter((p: Product) => {
      if (!query) return true;
      return [p.name, p.description, p.category]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .filter((p: Product) => !Number.isFinite(minPrice) || p.price >= Number(minPrice))
    .filter((p: Product) => !Number.isFinite(maxPrice) || p.price <= Number(maxPrice))
    .filter((p: Product) => !stockFilter || p.stock > 0)
    .filter((p: Product) => !promoFilter || Boolean(p.compare_at_price && p.compare_at_price > p.price))
    .sort((a: Product, b: Product) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const displayedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (categoryFilter) search.set("category", categoryFilter);
    if (params.q) search.set("q", params.q);
    if (params.min) search.set("min", params.min);
    if (params.max) search.set("max", params.max);
    if (stockFilter) search.set("stock", "in");
    if (promoFilter) search.set("promo", "yes");
    if (sort !== "newest") search.set("sort", sort);
    if (page > 1) search.set("page", String(page));
    const query = search.toString();
    return query ? `/products?${query}` : "/products";
  };

  const categoryHref = (category?: Category) => {
    const search = new URLSearchParams();
    if (category) search.set("category", category);
    if (params.q) search.set("q", params.q);
    if (params.min) search.set("min", params.min);
    if (params.max) search.set("max", params.max);
    if (stockFilter) search.set("stock", "in");
    if (promoFilter) search.set("promo", "yes");
    if (sort !== "newest") search.set("sort", sort);
    const categoryQuery = search.toString();
    return categoryQuery ? `/products?${categoryQuery}` : "/products";
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-20">
        <h1 className="font-serif text-4xl md:text-5xl tracking-widest mb-6">LA COLLECTION</h1>
        <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest text-muted">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={categoryHref(category.value)}
              className={`hover:text-accent transition-colors ${categoryFilter === category.value || (!categoryFilter && !category.value) ? 'text-accent' : ''}`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>

      <form action="/products" className="mb-14 border-y border-white/5 bg-[#08080C] px-4 py-6">
        {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Rechercher un produit"
            className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
          />
          <input
            type="number"
            name="min"
            min="0"
            step="1"
            defaultValue={params.min || ""}
            placeholder="Prix min"
            className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
          />
          <input
            type="number"
            name="max"
            min="0"
            step="1"
            defaultValue={params.max || ""}
            placeholder="Prix max"
            className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
          >
            <option value="newest">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
          <button type="submit" className="bg-accent text-primary px-6 py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors">
            Filtrer
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="stock" value="in" defaultChecked={stockFilter} className="accent-[#C8A96A]" />
            En stock seulement
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="promo" value="yes" defaultChecked={promoFilter} className="accent-[#C8A96A]" />
            Promotions seulement
          </label>
          <Link href={categoryFilter ? `/products?category=${categoryFilter}` : "/products"} className="ml-auto uppercase tracking-widest text-xs hover:text-accent transition-colors">
            Réinitialiser
          </Link>
        </div>
      </form>

      <div className="mb-8 text-sm text-muted">
        {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {displayedProducts.map((product, index) => (
          <div key={product.id} className={index % 3 === 1 ? 'md:mt-12' : ''}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {displayedProducts.length === 0 && (
        <div className="text-center py-20 text-muted font-light">
          Aucun produit trouvé dans cette catégorie.
        </div>
      )}

      {filteredProducts.length > PAGE_SIZE && (
        <div className="mt-16 flex items-center justify-center gap-3">
          <Link
            href={pageHref(Math.max(1, safePage - 1))}
            aria-disabled={safePage === 1}
            className={`px-5 py-3 border text-sm uppercase tracking-widest transition-colors ${
              safePage === 1
                ? "border-white/5 text-muted/40 pointer-events-none"
                : "border-white/10 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Précédent
          </Link>
          <span className="px-4 text-sm text-muted">
            {safePage} / {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, safePage + 1))}
            aria-disabled={safePage === totalPages}
            className={`px-5 py-3 border text-sm uppercase tracking-widest transition-colors ${
              safePage === totalPages
                ? "border-white/5 text-muted/40 pointer-events-none"
                : "border-white/10 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Suivant
          </Link>
        </div>
      )}
    </div>
  );
}
