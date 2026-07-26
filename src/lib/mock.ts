import { starterCatalog } from "@/lib/starter-catalog";

export type Category = 'parfum' | 'huile' | 'deodorant' | 'brume';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  image_url: string;
  category: Category;
  stock: number;
  admin_id?: string;
  seller_name: string;
  seller_whatsapp: string;
  created_at?: string;
  is_featured?: boolean;
}

export const mockProducts: Product[] = starterCatalog.map((product, index) => ({
  id: `starter-${index + 1}`,
  ...product,
  seller_name: "Essence Suprême",
  seller_whatsapp: "221781157773",
}));
