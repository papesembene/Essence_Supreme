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
}

export const mockProducts: Product[] = [
  {
    id: "eb35f8fc-0c2b-4afb-8b17-73d6b052aa95",
    name: "Oud Saphir Élixir",
    description: "Un parfum mystérieux aux notes boisées de Oud, adouci par la douceur de la vanille de Madagascar. Une essence séduisante et profondément luxueuse, idéale pour des soirées mémorables.",
    price: 45000,
    compare_at_price: 60000,
    image_url: "/images/perfume.png",
    category: "parfum",
    stock: 20,
    seller_name: "Essence Suprême",
    seller_whatsapp: "212600000000"
  },
  {
    id: "f8fc35eb-0c2b-4afb-8b17-73d6b052aa95",
    name: "Nectar d'Or Précieux",
    description: "Une huile parfumée riche et hydratante qui dépose un voile soyeux sur la peau. Les notes envoûtantes d'ambre et de néroli vous transportent au cœur de l'Orient.",
    price: 25000,
    compare_at_price: null,
    image_url: "/images/oil.png",
    category: "huile",
    stock: 50,
    seller_name: "Essence Suprême",
    seller_whatsapp: "212600000000"
  },
  {
    id: "2b0c4afb-f8fc-35eb-8b17-73d6b052aa95",
    name: "Charbon Actif Intense",
    description: "Un déodorant premium infusé au charbon actif, assurant une protection sans faille tout en libérant un parfum subtil de bois de cèdre et d'agrumes.",
    price: 7500,
    compare_at_price: 10000,
    image_url: "/images/deodorant.png",
    category: "deodorant",
    stock: 100,
    seller_name: "Essence Suprême",
    seller_whatsapp: "212600000000"
  },
  {
    id: "8b1773d6-b052-aa95-f8fc-0c2b4afb35eb",
    name: "Rose de Minuit",
    description: "Une réinterprétation moderne de la rose classique. Un parfum floral et poudré, infusé d'essence de poivre noir pour un sillage audacieux et inoubliable.",
    price: 39000,
    compare_at_price: null,
    image_url: "/images/perfume.png",
    category: "parfum",
    stock: 10,
    seller_name: "Essence Suprême",
    seller_whatsapp: "212600000000"
  },
  {
    id: "ad1773d6-b052-aa95-f8fc-0c2b4afb35ef",
    name: "Brume Ambre Velours",
    description: "Une brume légère pour le corps et les textiles, avec une signature ambrée douce et élégante pour rafraîchir le quotidien.",
    price: 12000,
    compare_at_price: 15000,
    image_url: "/images/perfume.png",
    category: "brume",
    stock: 30,
    seller_name: "Essence Suprême",
    seller_whatsapp: "212600000000"
  }
];
