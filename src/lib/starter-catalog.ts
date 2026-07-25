import type { Category } from "@/lib/mock";

export interface StarterCatalogProduct {
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  category: Category;
  stock: number;
}

const oilScents = [
  "Kayali 81",
  "Yara Rose",
  "Mélange",
  "Baccarat Rouge",
  "Scandale",
  "Bleu de Chanel",
  "Sauvage Dior",
  "Azzaro Chrome",
  "Kim K",
  "Sokhna Diarra",
  "Hypnose",
];

const muskScents = [
  "Pomme Grenadine",
  "Khamrah",
  "Musk Rouge",
  "Musk Rose",
  "Musk Lavander",
];

const scentDescriptions: Record<string, string> = {
  "Kayali 81": "Une huile de parfum douce et raffinée, entre chaleur orientale, vanille élégante et sillage féminin moderne.",
  "Yara Rose": "Une senteur rose, crémeuse et délicate, idéale pour un parfumage tendre, frais et très féminin.",
  "Mélange": "Un accord signature équilibré, pensé pour celles et ceux qui aiment un parfum présent sans être lourd.",
  "Baccarat Rouge": "Une huile lumineuse et sophistiquée aux accents ambrés, sucrés et boisés, avec un sillage remarquable.",
  Scandale: "Une senteur sensuelle et gourmande, généreuse, parfaite pour les sorties et les moments marquants.",
  "Bleu de Chanel": "Une inspiration fraîche, boisée et élégante, au caractère masculin propre et affirmé.",
  "Sauvage Dior": "Une huile fraîche et intense, avec une impression propre, épicée et très présente.",
  "Azzaro Chrome": "Une senteur fraîche, aquatique et propre, idéale pour la journée et le climat chaud.",
  "Kim K": "Une huile florale douce et glamour, féminine, moderne et facile à porter.",
  "Sokhna Diarra": "Une senteur douce, chaleureuse et enveloppante, appréciée pour son côté propre et distingué.",
  Hypnose: "Une huile élégante et mystérieuse, avec une douceur séduisante et un sillage confortable.",
  "Pomme Grenadine": "Un musc fruité, doux et joyeux, entre pomme sucrée et grenadine légère.",
  Khamrah: "Un musc ambré et gourmand, chaleureux, épicé et très enveloppant.",
  "Musk Rouge": "Un musc intense et élégant, doux mais marqué, avec une signature propre et sensuelle.",
  "Musk Rose": "Un musc floral tendre, propre et féminin, porté par une rose douce et délicate.",
  "Musk Lavander": "Un musc frais et apaisant, avec une touche lavande propre et confortable.",
};

const oilFormats = [
  { label: "Huile 3ml", price: 700, compare_at_price: null, stock: 30 },
  { label: "Huile 5ml", price: 1000, compare_at_price: null, stock: 30 },
  { label: "Extrait de Parfum 20ml", price: 2500, compare_at_price: 3000, stock: 20 },
];

const muskFormats = [
  { label: "Musc 3ml", price: 700, compare_at_price: null, stock: 30 },
  { label: "Musc 5ml", price: 1000, compare_at_price: null, stock: 30 },
];

function productDescription(scent: string, format: string) {
  return `${scentDescriptions[scent]} Format ${format}, pratique pour découvrir, offrir ou garder dans son sac au quotidien.`;
}

export const starterCatalog: StarterCatalogProduct[] = [
  ...oilScents.flatMap((scent) =>
    oilFormats.map((format) => ({
      name: `${scent} - ${format.label}`,
      description: productDescription(scent, format.label),
      price: format.price,
      compare_at_price: format.compare_at_price,
      image_url: "/images/products/huiles-rollon-premium.png",
      category: "huile" as const,
      stock: format.stock,
    }))
  ),
  ...muskScents.flatMap((scent) =>
    muskFormats.map((format) => ({
      name: `${scent} - ${format.label}`,
      description: productDescription(scent, format.label),
      price: format.price,
      compare_at_price: format.compare_at_price,
      image_url: "/images/products/huiles-rollon-premium.png",
      category: "huile" as const,
      stock: format.stock,
    }))
  ),
  {
    name: "Brume Parfumée - 100ml",
    description: "Une brume légère pour le corps et les vêtements, parfaite pour se rafraîchir dans la journée avec une touche parfumée élégante.",
    price: 2500,
    compare_at_price: 3000,
    image_url: "/images/perfume.png",
    category: "brume",
    stock: 20,
  },
  {
    name: "Déodorant Parfumé",
    description: "Un déodorant parfumé pour rester frais tout en gardant une senteur propre, agréable et adaptée au quotidien.",
    price: 1500,
    compare_at_price: null,
    image_url: "/images/deodorant.png",
    category: "deodorant",
    stock: 25,
  },
];
