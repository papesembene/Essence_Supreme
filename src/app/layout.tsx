import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.essence-supreme.store"),
  verification: {
    google: "BfBPRNL5DE766mUpw6buTusDNzgrL5uKpsxSKkItZqI",
    other: {
      "msvalidate.01": "657AAEB6E2B7EA127066D010D92EDD44",
    },
  },
  title: "Essence Supreme | Parfums, huiles et muscs à Dakar",
  description: "Essence Supreme, boutique en ligne de parfums, huiles parfumées, muscs, brumes et déodorants à Keur Ndiaye Lo et Mermoz, Dakar.",
  keywords: [
    "Essence Supreme",
    "Essence Suprême",
    "essence supreme store",
    "essence-supreme.store",
    "parfum Sénégal",
    "parfum Dakar",
    "huile de parfum Dakar",
    "huile de parfum Sénégal",
    "musc Dakar",
    "musc Sénégal",
    "brume parfumée",
    "déodorant parfumé",
    "Keur Ndiaye Lo",
    "Mermoz École de Police",
    "Orange Digital Center Dakar",
    "M, sem's",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Essence Supreme",
    description: "Huiles de parfum, muscs, brumes et déodorants à Keur Ndiaye Lo et Mermoz, par M, sem's.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Essence Supreme",
    alternateName: ["Essence Suprême", "Essence Supreme Store"],
    url: "https://www.essence-supreme.store",
    email: "contact@essence-supreme.store",
    founder: {
      "@type": "Person",
      name: "M, sem's",
    },
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Keur Ndiaye Lo",
        addressLocality: "Keur Ndiaye Lo",
        addressCountry: "SN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Immeuble Scalène, Mermoz École de Police, lot B, Orange Digital Center",
        addressLocality: "Dakar",
        addressRegion: "Dakar",
        addressCountry: "SN",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Sénégal",
    },
    description:
      "Boutique de parfums, huiles de parfum, muscs, brumes et déodorants à Keur Ndiaye Lo et Mermoz, Dakar.",
  };

  return (
    <html lang="fr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-primary text-secondary selection:bg-accent selection:text-primary" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
