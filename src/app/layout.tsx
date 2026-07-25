import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.essence-supreme.store"),
  title: "Essence Suprême | L'essence du luxe, dans chaque goutte",
  description: "Boutique en ligne premium de parfums, huiles parfumées, brumes et déodorants.",
  keywords: [
    "Essence Suprême",
    "parfum Sénégal",
    "huile de parfum Dakar",
    "musc Dakar",
    "brume parfumée",
    "déodorant parfumé",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Essence Suprême",
    description: "Huiles de parfum, muscs, brumes et déodorants à Dakar.",
    url: "https://www.essence-supreme.store",
    siteName: "Essence Suprême",
    locale: "fr_SN",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-primary text-secondary selection:bg-accent selection:text-primary" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
