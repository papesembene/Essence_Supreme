"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-primary/80 backdrop-blur-md py-4 border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-xl sm:text-2xl tracking-widest text-accent z-50 whitespace-nowrap">
            ESSENCE SUPRÊME
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 tracking-wide text-sm font-light">
            <Link href="/products?category=parfum" className="hover:text-accent transition-colors duration-300">PARFUMS</Link>
            <Link href="/products?category=huile" className="hover:text-accent transition-colors duration-300">HUILES</Link>
            <Link href="/products?category=deodorant" className="hover:text-accent transition-colors duration-300">DÉODORANTS</Link>
            <Link href="/products?category=brume" className="hover:text-accent transition-colors duration-300">BRUMES</Link>
            <Link href="/about" className="hover:text-accent transition-colors duration-300">À PROPOS</Link>
          </nav>

          <div className="hidden lg:flex items-center z-50">
            <CartDrawer />
          </div>

          <div className="flex items-center space-x-5 z-50 lg:hidden">
            <CartDrawer />
            <button className="text-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-40 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center px-6"
          >
            <nav className="flex flex-col space-y-8 text-center text-xl sm:text-2xl font-serif tracking-widest">
              <Link href="/products?category=parfum" onClick={() => setMobileMenuOpen(false)} className="hover:text-accent transition-colors">PARFUMS</Link>
              <Link href="/products?category=huile" onClick={() => setMobileMenuOpen(false)} className="hover:text-accent transition-colors">HUILES</Link>
              <Link href="/products?category=deodorant" onClick={() => setMobileMenuOpen(false)} className="hover:text-accent transition-colors">DÉODORANTS</Link>
              <Link href="/products?category=brume" onClick={() => setMobileMenuOpen(false)} className="hover:text-accent transition-colors">BRUMES</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-accent transition-colors">À PROPOS</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
