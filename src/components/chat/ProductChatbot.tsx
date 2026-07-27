"use client";

import { FormEvent, useState } from "react";
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

export function ProductChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Bonjour, je peux vous aider à trouver une brume, un deo, une huile, un musc ou un parfum selon votre budget."
    }
  ]);

  function openChat() {
    setIsOpen(true);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const visibleHistory = messages
      .filter((message) => !("products" in message && message.products?.length))
      .map((message) => ({ role: message.role, text: message.text }));
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          history: visibleHistory
        })
      });
      const answer = (await response.json()) as {
        text?: string;
        products?: Product[];
      };

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text:
            answer.text ||
            "Je peux vous aider sur les produits Essence Suprême, les prix, la commande et la livraison.",
          products: answer.products || []
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: "L'assistant IA est indisponible pour le moment. Réessayez dans quelques instants.",
          products: []
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function sendQuickPrompt(prompt: string) {
    void sendMessage(prompt);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function closeChat() {
    setIsOpen(false);
  }

  function renderMessages() {
    return messages.map((message) => (
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
                    onClick={closeChat}
                  >
                    <div className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
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
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
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
    ));
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[9000] sm:inset-x-auto sm:right-6 sm:bottom-6">
      {isOpen && (
        <div className="mb-3 flex h-[min(680px,calc(100dvh-5.5rem))] w-full flex-col overflow-hidden border border-white/10 bg-[#101014] shadow-2xl shadow-black/50 sm:mb-4 sm:w-[390px] sm:max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary sm:h-10 sm:w-10">
                <Sparkles size={17} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-secondary sm:text-sm sm:tracking-[0.16em]">
                  Assistant IA Essence
                </p>
                <p className="text-xs text-muted">
                  Produits, prix et commande
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer le chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4">
            {renderMessages()}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] px-4 py-3 text-sm text-muted">
                  Je réfléchis...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3 sm:p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendQuickPrompt(prompt)}
                  disabled={isSending}
                  className="shrink-0 border border-white/10 px-3 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
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
                  disabled={isSending}
                  className="h-11 w-full border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-secondary outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-60 sm:h-12"
                />
              </label>
              <button
                type="submit"
                disabled={isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-primary transition-colors hover:bg-white disabled:opacity-60 sm:h-12 sm:w-12"
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
        className="ml-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-primary shadow-xl shadow-black/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/50 sm:h-14 sm:w-14"
        aria-label="Ouvrir le chatbot produit"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
