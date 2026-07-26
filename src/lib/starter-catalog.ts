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

type CatalogItem = Omit<StarterCatalogProduct, "category" | "stock">;

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

const deodorants: CatalogItem[] = [
  {
    name: "Déodorant Parfumé - Fraîcheur",
    description: "Un déodorant parfumé frais et propre, idéal pour rester à l'aise toute la journée. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-1.jpeg",
  },
  {
    name: "Déodorant Parfumé - Élégance",
    description: "Une senteur élégante et douce pour accompagner le quotidien, avec une sensation de fraîcheur. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-2.jpeg",
  },
  {
    name: "Déodorant Parfumé - Intense",
    description: "Un déodorant parfumé plus marqué, pensé pour celles et ceux qui aiment une présence propre et durable. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-3.jpeg",
  },
  {
    name: "Déodorant Parfumé - Douceur",
    description: "Une formule parfumée agréable, facile à porter, parfaite après la douche ou avant de sortir. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-4.jpeg",
  },
  {
    name: "Déodorant Parfumé - Signature",
    description: "Un déodorant parfumé au style soigné, pour garder une senteur nette sans payer cher. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-5.jpeg",
  },
  {
    name: "Déodorant Parfumé - Everyday",
    description: "Le choix simple pour tous les jours: fraîcheur, bonne odeur et prix accessible. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 1800,
    image_url: "/deo/deo-6.jpeg",
  },
];

const dubaiDeodorants: CatalogItem[] = [
  {
    name: "Deo Dubaï - Oud Royal",
    description: "Un deo Dubaï au style oriental, chaud et élégant, avec une senteur oud propre qui donne une vraie présence au quotidien. Avec le code AOUT26, il revient à 2500 FCFA.",
    price: 2580,
    compare_at_price: 3000,
    image_url: "/deo/deo-dubai-1.jpeg",
  },
  {
    name: "Deo Dubaï - Amber Fresh",
    description: "Une fraîcheur ambrée inspirée de Dubaï, agréable après la douche et parfaite pour garder une odeur soignée toute la journée. Avec le code AOUT26, il revient à 2500 FCFA.",
    price: 2580,
    compare_at_price: 3000,
    image_url: "/deo/deo-dubai-2.jpeg",
  },
  {
    name: "Deo Dubaï - Musk Gold",
    description: "Un deo parfumé doux et musqué, avec une touche dorée élégante. Idéal pour celles et ceux qui aiment les senteurs propres. Avec le code AOUT26, il revient à 2500 FCFA.",
    price: 2580,
    compare_at_price: 3000,
    image_url: "/deo/deo-dubai-3.jpeg",
  },
  {
    name: "Deo Dubaï - Intense Night",
    description: "Une senteur plus intense, raffinée et durable, pensée pour les sorties, les occasions et les amateurs de parfums marqués. Avec le code AOUT26, il revient à 2500 FCFA.",
    price: 2580,
    compare_at_price: 3000,
    image_url: "/deo/deo-dubai-4.jpeg",
  },
  {
    name: "Deo Dubaï - Rose Oud",
    description: "Un accord rose et oud doux, chic et facile à porter, avec un prix code à 2500 FCFA pour une collection premium.",
    price: 2580,
    compare_at_price: 3000,
    image_url: "/deo/deo-dubai-5.jpeg",
  },
];

const perfumes4000: CatalogItem[] = [
  {
    name: "Parfum Collection - Élégance",
    description: "Un parfum raffiné, pensé pour garder une senteur propre, chic et présente sans être trop lourde. Avec le code AOUT26, il revient à 4000 FCFA.",
    price: 4080,
    compare_at_price: 5000,
    image_url: "/parfums/parfum-4000-1.jpeg",
  },
  {
    name: "Parfum Collection - Signature",
    description: "Une fragrance élégante et moderne, idéale pour les sorties, le travail et les moments importants. Avec le code AOUT26, il revient à 4000 FCFA.",
    price: 4080,
    compare_at_price: 5000,
    image_url: "/parfums/parfum-4000-2.jpeg",
  },
  {
    name: "Parfum Collection - Prestige",
    description: "Un parfum au style premium, avec une belle présence et un prix accessible. Avec le code AOUT26, il revient à 4000 FCFA.",
    price: 4080,
    compare_at_price: 5000,
    image_url: "/parfums/parfum-4000-3.jpeg",
  },
  {
    name: "Parfum Collection - Royal",
    description: "Une senteur soignée, douce et marquante pour un parfum élégant au quotidien. Avec le code AOUT26, il revient à 4000 FCFA.",
    price: 4080,
    compare_at_price: 5000,
    image_url: "/parfums/parfum-4000-4.jpeg",
  },
];

const promoPerfumes: CatalogItem[] = [
  {
    name: "Parfum Promo - Fresh",
    description: "Un parfum accessible, frais et agréable. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 2000,
    image_url: "/parfums/parfum-promo-1.png",
  },
  {
    name: "Parfum Promo - Soft",
    description: "Une senteur douce, propre et facile à porter. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 2000,
    image_url: "/parfums/parfum-promo-2.png",
  },
  {
    name: "Parfum Promo - Daily",
    description: "Le bon plan parfum du quotidien: prix accessible, belle odeur et commande simple sur WhatsApp. Avec le code AOUT26, il revient à 1500 FCFA.",
    price: 1580,
    compare_at_price: 2000,
    image_url: "/parfums/parfum-promo-3.png",
  },
];

const vvLoveBrumeStyles = [
  "Cherry Love",
  "Vanilla Glow",
  "Sweet Rose",
  "Coconut Dream",
  "Amber Kiss",
  "Fresh Bloom",
  "Velvet Musk",
  "Pink Sugar",
  "Golden Mist",
  "Soft Orchid",
];

const vvLoveBrumes: CatalogItem[] = Array.from({ length: 30 }, (_, index) => {
  const style = vvLoveBrumeStyles[index % vvLoveBrumeStyles.length];

  return {
    name: `Brume VV Love - ${style} ${index + 1}`,
    description: `Une brume VV Love légère et parfumée à 3000 FCFA, parfaite pour le corps et les vêtements. Senteur ${style.toLowerCase()}, douce, fraîche et facile à porter au quotidien.`,
    price: 3080,
    compare_at_price: 3500,
    image_url: `/brumes/brume-vv-love-${index + 1}.jpeg`,
  };
});

const madeInFranceBrumeStyles = [
  "Éclat Floral",
  "Vanille Douce",
  "Rose Fraîche",
  "Musc Blanc",
  "Coco Chic",
  "Amber Soft",
  "Fresh Love",
];

const madeInFranceBrumes: CatalogItem[] = madeInFranceBrumeStyles.map(
  (style, index) => ({
    name: `Brume Made in France 250ml - ${style}`,
    description: `Brume Made in France 250ml, meilleur de chez meilleur, avec une senteur ${style.toLowerCase()} élégante et agréable. Avec le code AOUT26, elle revient à 2500 FCFA.`,
    price: 2580,
    compare_at_price: 3000,
    image_url: `/brumes/brume-france-${index + 1}.jpeg`,
  })
);

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
  ...vvLoveBrumes.map((brume) => ({
    ...brume,
    category: "brume" as const,
    stock: 20,
  })),
  ...madeInFranceBrumes.map((brume) => ({
    ...brume,
    category: "brume" as const,
    stock: 20,
  })),
  ...perfumes4000.map((perfume) => ({
    ...perfume,
    category: "parfum" as const,
    stock: 20,
  })),
  ...promoPerfumes.map((perfume) => ({
    ...perfume,
    category: "parfum" as const,
    stock: 25,
  })),
  ...deodorants.map((deodorant) => ({
    ...deodorant,
    category: "deodorant" as const,
    stock: 25,
  })),
  ...dubaiDeodorants.map((deodorant) => ({
    ...deodorant,
    category: "deodorant" as const,
    stock: 20,
  })),
];
