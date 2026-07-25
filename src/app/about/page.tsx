import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Sparkles, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos | Essence Supreme Dakar",
  description:
    "Essence Supreme est une boutique de parfums, huiles de parfum, muscs, brumes et déodorants basée à Dakar, Sénégal. Propriétaire: M,sem's.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <section className="max-w-4xl">
        <p className="text-accent uppercase tracking-widest text-sm mb-4">
          Dakar, Sénégal
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-widest leading-tight mb-8">
          ESSENCE SUPREME
        </h1>
        <p className="text-muted text-lg sm:text-xl font-light leading-relaxed">
          Essence Supreme, aussi appelée Essence Suprême, est une boutique de
          parfums basée à Dakar. Nous proposons des huiles de parfum, muscs,
          brumes parfumées et déodorants pour celles et ceux qui veulent une
          senteur élégante, accessible et facile à porter au quotidien.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="border border-white/10 bg-[#08080C] p-6">
          <Sparkles className="text-accent mb-5" size={28} strokeWidth={1.5} />
          <h2 className="font-serif text-xl tracking-widest mb-3">
            Nos produits
          </h2>
          <p className="text-muted font-light leading-relaxed">
            Huiles 3ml, huiles 5ml, extraits 20ml, muscs, brumes et déodorants,
            avec des senteurs appréciées comme Yara Rose, Kayali 81, Khamrah,
            Musk Rose, Baccarat Rouge, Sauvage Dior et d'autres inspirations.
          </p>
        </div>

        <div className="border border-white/10 bg-[#08080C] p-6">
          <MapPin className="text-accent mb-5" size={28} strokeWidth={1.5} />
          <h2 className="font-serif text-xl tracking-widest mb-3">
            Notre base
          </h2>
          <p className="text-muted font-light leading-relaxed">
            La boutique est basée à Dakar, Sénégal. Les commandes sont préparées
            avec attention et confirmées directement par WhatsApp pour garder un
            contact simple et rapide avec les clients.
          </p>
        </div>

        <div className="border border-white/10 bg-[#08080C] p-6">
          <Truck className="text-accent mb-5" size={28} strokeWidth={1.5} />
          <h2 className="font-serif text-xl tracking-widest mb-3">
            Commande
          </h2>
          <p className="text-muted font-light leading-relaxed">
            Ajoutez vos produits au panier, validez la commande, puis le message
            WhatsApp est envoyé au bon vendeur pour confirmer disponibilité,
            paiement et livraison.
          </p>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 border-y border-white/10 py-10">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-widest mb-4">
            Propriétaire
          </h2>
          <p className="text-muted font-light leading-relaxed max-w-2xl">
            Essence Supreme appartient à M,sem&apos;s. Le site
            essence-supreme.store sert à présenter le catalogue, faciliter les
            commandes et mettre en avant les senteurs disponibles au Sénégal.
          </p>
        </div>
        <div className="space-y-4 text-sm text-muted">
          <p className="flex items-center gap-3">
            <MapPin size={18} className="text-accent" />
            Dakar, Sénégal
          </p>
          <a
            href="mailto:contact@essence-supreme.store"
            className="flex items-center gap-3 hover:text-accent transition-colors"
          >
            <Mail size={18} className="text-accent" />
            contact@essence-supreme.store
          </a>
        </div>
      </section>

      <div className="mt-12">
        <Link
          href="/products"
          className="inline-flex bg-accent text-primary px-8 py-4 uppercase tracking-widest font-semibold hover:bg-white transition-colors"
        >
          Voir la collection
        </Link>
      </div>
    </div>
  );
}
