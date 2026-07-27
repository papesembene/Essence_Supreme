import { Product, mockProducts } from "@/lib/mock";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type ProductRecord = Product & {
  compare_at_price?: number | string | null;
  price: number | string;
};

class OpenAIRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string
  ) {
    super(message);
  }
}

function normalizeProduct(product: ProductRecord): Product {
  return {
    ...product,
    price: Number(product.price),
    compare_at_price:
      product.compare_at_price === null || product.compare_at_price === undefined
        ? null
        : Number(product.compare_at_price),
    seller_name: product.seller_name || "Essence Suprême",
    seller_whatsapp: product.seller_whatsapp || "221781157773"
  };
}

async function getCatalog() {
  const supabase = createServerSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(80);

    if (data?.length) {
      return (data as ProductRecord[]).map(normalizeProduct);
    }
  }

  return mockProducts.filter((product) => product.stock > 0).slice(0, 80);
}

function compactProduct(product: Product) {
  return {
    id: product.id,
    nom: product.name,
    categorie: product.category,
    prix_fcfa: product.price,
    ancien_prix_fcfa: product.compare_at_price || null,
    stock: product.stock,
    description: product.description.slice(0, 180)
  };
}

function extractOutputText(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "output_text" in payload &&
    typeof payload.output_text === "string"
  ) {
    return payload.output_text;
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "output" in payload &&
    Array.isArray(payload.output)
  ) {
    return payload.output
      .flatMap((item) => {
        if (
          typeof item !== "object" ||
          item === null ||
          !("content" in item) ||
          !Array.isArray(item.content)
        ) {
          return [];
        }

        return (item.content as unknown[])
          .map((content: unknown) => {
            if (
              typeof content === "object" &&
              content !== null &&
              "text" in content &&
              typeof content.text === "string"
            ) {
              return content.text;
            }

            return "";
          })
          .filter(Boolean);
      })
      .join("\n");
  }

  return "";
}

function parseAssistantJson(text: string) {
  try {
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned) as {
      text?: string;
      productIds?: string[];
    };

    return {
      text: parsed.text || "",
      productIds: Array.isArray(parsed.productIds) ? parsed.productIds : []
    };
  } catch {
    return {
      text,
      productIds: []
    };
  }
}

function getModelsToTry() {
  return [
    process.env.OPENAI_CHAT_MODEL,
    "gpt-4o-mini",
    "gpt-5.6-luna"
  ].filter((model, index, models): model is string => {
    return Boolean(model) && models.indexOf(model) === index;
  });
}

async function requestOpenAI(prompt: string) {
  const models = getModelsToTry();
  let lastError: OpenAIRequestError | null = null;

  for (const model of models) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: prompt,
        max_output_tokens: 500
      })
    });

    if (response.ok) {
      return response.json() as Promise<unknown>;
    }

    const errorText = await response.text();
    let code: string | undefined;
    let message = errorText;

    try {
      const parsed = JSON.parse(errorText) as {
        error?: {
          code?: string;
          message?: string;
          type?: string;
        };
      };
      code = parsed.error?.code || parsed.error?.type;
      message = parsed.error?.message || errorText;
    } catch {
      message = errorText;
    }

    lastError = new OpenAIRequestError(message, response.status, code);

    if (![400, 404].includes(response.status)) {
      throw lastError;
    }
  }

  throw lastError || new OpenAIRequestError("OpenAI request failed", 500);
}

function userFriendlyOpenAIError(error: unknown) {
  if (!(error instanceof OpenAIRequestError)) {
    return "L'assistant IA est momentanément indisponible. Vous pouvez chercher dans la page Produits ou commander par WhatsApp.";
  }

  if (error.status === 401) {
    return "La clé OpenAI semble invalide. Vérifiez OPENAI_API_KEY dans Vercel, puis redéployez.";
  }

  if (error.status === 429 || error.code === "insufficient_quota") {
    return "Le compte OpenAI n'a pas assez de crédit ou a atteint sa limite. Ajoutez du crédit sur OpenAI Platform, puis réessayez.";
  }

  if (error.status === 400 || error.status === 404) {
    return "Le modèle OpenAI configuré n'est pas disponible sur ce compte. Supprimez OPENAI_CHAT_MODEL dans Vercel ou mettez gpt-4o-mini.";
  }

  return "OpenAI ne répond pas correctement pour le moment. Réessayez dans quelques instants.";
}

export async function POST(request: Request) {
  const { message, history } = (await request.json()) as {
    message?: string;
    history?: ChatMessage[];
  };
  const userMessage = message?.trim();

  if (!userMessage) {
    return Response.json({
      text: "Envoyez-moi votre question ou le produit que vous cherchez.",
      products: []
    });
  }

  const products = await getCatalog();

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      text: "L'assistant IA n'est pas encore configuré. Il manque la variable serveur OPENAI_API_KEY dans Vercel.",
      products: []
    });
  }

  const catalog = products.map(compactProduct);
  const recentHistory = (history || [])
    .slice(-6)
    .map((item) => `${item.role === "user" ? "Client" : "Assistant"}: ${item.text}`)
    .join("\n");

  const prompt = `
Tu es l'assistant IA officiel de la boutique Essence Suprême au Sénégal.

Règles strictes:
- Réponds uniquement aux questions liées à Essence Suprême: produits, senteurs, prix, stock, commande, panier, WhatsApp, livraison, localisation, code promo.
- Si la question est hors sujet, réponds poliment que tu ne peux aider que sur la boutique Essence Suprême.
- Si le client dit seulement bonjour, salut ou merci, réponds naturellement sans recommander de produits.
- Si le client cherche un produit, une senteur, une catégorie ou un budget, sélectionne jusqu'à 4 productIds pertinents dans le catalogue.
- N'invente jamais un produit, un prix, un stock, une remise ou une adresse.
- Les prix sont toujours en FCFA.
- Le contact WhatsApp principal est 78 115 77 73.
- Les adresses de la boutique sont: Keur Ndiaye Lo; et Immeuble Scalène, Mermoz École de Police, lot B, Orange Digital Center, Dakar.
- Le code promo actuel est AOUT26 avec -5%.
- Réponse courte, utile, en français naturel.
- Réponds uniquement en JSON valide sous cette forme exacte: {"text":"...","productIds":["id1","id2"]}.

Historique récent:
${recentHistory || "Aucun"}

Catalogue disponible:
${JSON.stringify(catalog)}

Question client:
${userMessage}
`;

  try {
    const payload = await requestOpenAI(prompt);
    const answer = parseAssistantJson(extractOutputText(payload));
    const selectedProducts = answer.productIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product))
      .slice(0, 4);

    return Response.json({
      text:
        answer.text ||
        "Je peux vous aider sur les produits Essence Suprême, les prix, la commande et la livraison.",
      products: selectedProducts
    });
  } catch (error) {
    console.error("Chatbot OpenAI error", error);
    return Response.json(
      {
        text: userFriendlyOpenAIError(error),
        products: []
      },
      { status: 503 }
    );
  }
}
