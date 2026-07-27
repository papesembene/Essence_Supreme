"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Search, Send, Sparkles, X } from "lucide-react";
import { Product } from "@/lib/mock";
import { discountPercent, formatPrice } from "@/lib/pricing";

type Message =
  | {
      id: string;
      role: "assistant" | "user";
      text: string;
      products?: Product[];
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      products: Product[];
    };

const quickPrompts = ["Brume 2500", "Musc", "Deo Dubai", "Parfum 4000"];

const categoryLabels: Record<Product["category"], string> = {
  parfum: "Parfum",
  huile: "Huile et musc",
  deodorant: "Déodorant",
  brume: "Brume"
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategoryIntent(query: string): Product["category"] | null {
  if (/\b(brume|vv love|made in france)\b/.test(query)) return "brume";
  if (/\b(deo|deodorant|deodorants|duba[iy])\b/.test(query)) return "deodorant";
  if (/\b(parfum|extrait|collection)\b/.test(query)) return "parfum";
  if (/\b(huile|musc|musk|rollon|roll on)\b/.test(query)) return "huile";
  return null;
}

function getBudget(query: string) {
  const prices = query.match(/\d[\d\s.]*/g);
  if (!prices?.length) return null;

  const value = Number(prices[0].replace(/\D/g, ""));
  if (!value) return null;

  if (/\b(plus de|minimum|min)\b/.test(query)) {
    return { type: "min" as const, value };
  }

  return { type: "max" as const, value: value + 120 };
}

function scoreProduct(product: Product, query: string, terms: string[]) {
  const categoryIntent = getCategoryIntent(query);
  const budget = getBudget(query);
  const searchable = normalizeText(
    `${product.name} ${product.description} ${product.category}`
  );
  let score = 0;

  if (categoryIntent && product.category === categoryIntent) score += 10;
  if (query.includes("musc") && searchable.includes("musc")) score += 8;
  if (query.includes("dubai") && searchable.includes("dubai")) score += 8;
  if (query.includes("france") && searchable.includes("france")) score += 8;

  for (const term of terms) {
    if (term.length < 3 || ["fcfa", "prix", "cherche", "veux"].includes(term)) {
      continue;
    }
    if (searchable.includes(term)) score += 3;
  }

  if (budget) {
    if (budget.type === "max" && product.price <= budget.value) score += 5;
    if (budget.type === "min" && product.price >= budget.value) score += 5;
  }

  return score;
}

function findSuggestions(products: Product[], message: string) {
  const query = normalizeText(message);
  const terms = query.split(" ").filter(Boolean);
  const categoryIntent = getCategoryIntent(query);
  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, query, terms) }))
    .filter(({ product, score }) => {
      if (score <= 0) return false;
      if (!categoryIntent) return true;
      return product.category === categoryIntent;
    })
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .map(({ product }) => product);

  if (scored.length) return scored.slice(0, 4);

  return [...products]
    .sort((a, b) => {
      const first = a.created_at ? new Date(a.created_at).getTime() : 0;
      const second = b.created_at ? new Date(b.created_at).getTime() : 0;
      return second - first;
    })
    .slice(0, 4);
}

function buildAnswer(products: Product[], userText: string) {
  const query = normalizeText(userText);
  const suggestions = findSuggestions(products, userText);

  if (!products.length) {
    return {
      text: "Je n'arrive pas à charger le catalogue pour le moment. Vous pouvez ouvrir la page produits ou commander directement par WhatsApp.",
      products: []
    };
  }

  if (suggestions.length && (getCategoryIntent(query) || getBudget(query))) {
    return {
      text: "Voici les produits qui correspondent le mieux à votre recherche.",
      products: suggestions
    };
  }

  if (suggestions.length) {
    return {
      text: "Je vous propose ces produits disponibles. Vous pouvez aussi préciser une senteur, une catégorie ou un budget.",
      products: suggestions
    };
  }

  return {
    text: "Je n'ai pas trouvé de résultat exact. Essayez par exemple: brume 2500, musc rose, deo Dubai ou parfum 4000.",
    products: []
  };
}

export function ProductChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Bonjour, je peux vous aider à trouver une brume, un deo, une huile, un musc ou un parfum selon votre budget."
    }
  ]);

  const productCount = useMemo(() => products.length, [products]);

  async function loadProducts() {
    if (products.length || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/products");
      const data = (await response.json()) as { products?: Product[] };
      setProducts(data.products || []);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: "Je n'arrive pas à charger le catalogue. Réessayez dans quelques instants."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function openChat() {
    setIsOpen(true);
    void loadProducts();
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const answer = buildAnswer(products, trimmed);
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text: trimmed },
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: answer.text,
        products: answer.products
      }
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-4 z-[9000] sm:right-6">
      {isOpen && (
        <div className="mb-4 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden border border-white/10 bg-[#101014] shadow-2xl shadow-black/50 sm:w-[390px]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Sparkles size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
                  Assistant Essence
                </p>
                <p className="text-xs text-muted">
                  {isLoading ? "Chargement..." : `${productCount} produits à conseiller`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer le chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] ${
                    message.role === "user"
                      ? "bg-accent px-4 py-3 text-primary"
                      : "bg-white/[0.06] px-4 py-3 text-secondary"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {"products" in message && message.products?.length ? (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => {
                        const discount = discountPercent(
                          product.price,
                          product.compare_at_price
                        );

                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="block border border-white/10 bg-primary/60 p-3 transition-colors hover:border-accent/70"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="line-clamp-2 text-sm font-semibold text-secondary">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-accent">
                                  {categoryLabels[product.category]}
                                </p>
                              </div>
                              {discount && (
                                <span className="shrink-0 bg-red-500/15 px-2 py-1 text-[11px] font-semibold text-red-300">
                                  -{discount}%
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              {product.compare_at_price &&
                                product.compare_at_price > product.price && (
                                  <span className="text-xs text-muted line-through">
                                    {formatPrice(product.compare_at_price)}
                                  </span>
                                )}
                              <span className="font-semibold text-white">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 border border-white/10 px-3 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ex: musc rose, brume 2500..."
                  className="h-12 w-full border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-secondary outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
              </label>
              <button
                type="submit"
                className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent text-primary transition-colors hover:bg-white"
                aria-label="Envoyer"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={openChat}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary shadow-xl shadow-black/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/50"
        aria-label="Ouvrir le chatbot produit"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
