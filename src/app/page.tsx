"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { mockProducts } from "@/lib/mock";
import { ProductCard } from "@/components/product/ProductCard";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-20">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 tracking-widest leading-tight"
          >
            L'ESSENCE DU <span className="text-accent italic">LUXE</span>,<br /> DANS CHAQUE GOUTTE
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUpVariant} transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto"
          >
            Découvrez une collection exclusive de fragrances mystérieuses, d'huiles précieuses et d'essences rares créées pour les esprits exigeants.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} transition={{ delay: 0.4 }}>
            <Link 
              href="/products"
              className="inline-flex items-center space-x-3 bg-accent text-primary px-8 py-4 uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300"
            >
              <span>Découvrir la collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest mb-4">CRÉATIONS SIGNATURE</h2>
            <p className="text-muted font-light leading-relaxed">
              Une sélection de nos œuvres les plus convoitées. Des senteurs intemporelles qui redéfinissent l'élégance absolue.
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

      {/* Categories Banner */}
      <section className="border-y border-white/5 bg-[#08080C] py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/products?category=parfum" className="group relative h-[400px] overflow-hidden flex items-center justify-center bg-[#0d0d14]">
            <Image src="/images/perfume.png" alt="Parfums" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">PARFUMS</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=huile" className="group relative h-[400px] overflow-hidden flex items-center justify-center bg-[#0d0d14] lg:-translate-y-8">
            <Image src="/images/oil.png" alt="Huiles" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">HUILES</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=deodorant" className="group relative h-[400px] overflow-hidden flex items-center justify-center bg-[#0d0d14] lg:translate-y-8">
            <Image src="/images/deodorant.png" alt="Déodorants" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl tracking-widest mb-4">DÉODORANTS</h3>
              <span className="text-accent tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
            </div>
          </Link>
          <Link href="/products?category=brume" className="group relative h-[400px] overflow-hidden flex items-center justify-center bg-[#0d0d14]">
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
