"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { mockProducts } from "@/lib/mock";
import { ProductCard } from "@/components/product/ProductCard";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 3);
  const testimonials = [
    {
      name: "Khadidjatou Fall",
      quote: "Les huiles sont trop bonnes et les prix restent moins chers. J'aime surtout le fait d'avoir de belles senteurs sans payer trop."
    },
    {
      name: "Ndeye Oumy Ndiaye",
      quote: "Les extraits tiennent bien, les formats sont pratiques et les prix sont uniques. C'est devenu mon bon plan parfum."
    },
    {
      name: "Rouguiyatou Barro",
      quote: "Les muscs sentent vraiment bon, doux et élégants. Les prix sont abordables et on peut commander facilement sur WhatsApp."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative flex h-[82vh] min-h-[620px] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Essence Suprême Luxe"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="mb-6 font-serif text-4xl leading-tight tracking-widest md:text-5xl lg:text-6xl"
          >
            L&apos;ESSENCE DU <span className="text-accent italic">LUXE</span>,<br /> DANS CHAQUE GOUTTE
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUpVariant} transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto"
          >
            Découvrez une collection exclusive de fragrances mystérieuses, d&apos;huiles précieuses et d&apos;essences rares créées pour les esprits exigeants.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} transition={{ delay: 0.4 }}>
            <Link 
              href="/products"
              className="inline-flex items-center space-x-3 bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:bg-white"
            >
              <span>Découvrir la collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-20 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest mb-4">CRÉATIONS SIGNATURE</h2>
            <p className="text-muted font-light leading-relaxed">
              Une sélection de nos œuvres les plus convoitées. Des senteurs intemporelles qui redéfinissent l&apos;élégance absolue.
            </p>
          </div>
          <Link href="/products" className="mt-8 md:mt-0 uppercase tracking-widest text-sm text-accent hover:text-white transition-colors flex items-center space-x-2">
            <span>Voir tout</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#101015] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Avis clients
            </p>
            <h2 className="font-serif text-3xl tracking-widest md:text-4xl">
              Elles ont aimé Essence Suprême
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="border border-white/10 bg-primary/50 p-6">
                <Quote className="mb-6 text-accent" size={24} strokeWidth={1.4} />
                <p className="mb-6 text-sm leading-7 text-muted">{testimonial.quote}</p>
                <p className="font-serif text-lg tracking-widest text-secondary">
                  {testimonial.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="border-y border-white/5 bg-[#08080C] py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/products?category=parfum" className="group relative flex h-[320px] items-center justify-center overflow-hidden bg-[#0d0d14] md:h-[360px]">
            <Image src="/parfums/parfum-4000-1.jpeg" alt="Parfums" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">PARFUMS</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=huile" className="group relative flex h-[320px] items-center justify-center overflow-hidden bg-[#0d0d14] md:h-[360px] lg:-translate-y-8">
            <Image src="/images/oil.png" alt="Huiles" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">HUILES</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=deodorant" className="group relative flex h-[320px] items-center justify-center overflow-hidden bg-[#0d0d14] md:h-[360px] lg:translate-y-8">
            <Image src="/deo/deo-1.jpeg" alt="Déodorants" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">DÉODORANTS</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=brume" className="group relative flex h-[320px] items-center justify-center overflow-hidden bg-[#0d0d14] md:h-[360px]">
            <Image src="/images/perfume.png" alt="Brumes" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">BRUMES</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
