"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/components/cart/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <CartProvider>
        <main className="min-h-screen bg-primary text-secondary">{children}</main>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-grow flex flex-col pt-24">{children}</main>
      <Footer />
    </CartProvider>
  );
}
