import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-16">
          <div className="flex flex-col items-start">
            <h3 className="font-serif text-2xl tracking-widest text-accent mb-6">ESSENCE SUPRÊME</h3>
            <p className="text-muted font-light leading-relaxed max-w-sm">
              L'essence du luxe, dans chaque goutte. La parfumerie moderne alliant tradition et création olfactive d'exception.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-center">
            <div>
              <h4 className="font-serif tracking-wider mb-6">COLLECTIONS</h4>
              <ul className="space-y-4 text-muted font-light text-sm">
                <li><Link href="/products?category=parfum" className="hover:text-accent transition-colors">Parfums</Link></li>
                <li><Link href="/products?category=huile" className="hover:text-accent transition-colors">Huiles Précieuses</Link></li>
                <li><Link href="/products?category=deodorant" className="hover:text-accent transition-colors">Déodorants</Link></li>
                <li><Link href="/products?category=brume" className="hover:text-accent transition-colors">Brumes</Link></li>
                <li><Link href="/about" className="hover:text-accent transition-colors">À propos</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right">
            <div>
              <h4 className="font-serif tracking-wider mb-6">CONTACT</h4>
              <ul className="space-y-4 text-muted font-light text-sm">
                <li className="flex items-center space-x-3 md:justify-end">
                  <span className="order-2 md:order-1">Dakar, Sénégal</span>
                  <MapPin size={16} strokeWidth={1} className="text-accent order-1 md:order-2 md:ml-3" />
                </li>
                <li className="flex items-center space-x-3 md:justify-end">
                  <a href="mailto:contact@essence-supreme.store" className="order-2 md:order-1 hover:text-accent transition-colors">contact@essence-supreme.store</a>
                  <Mail size={16} strokeWidth={1} className="text-accent order-1 md:order-2 md:ml-3" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        
        <div className="border-t border-white/5 pt-8 text-center text-xs text-muted font-light tracking-wide flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ESSENCE SUPRÊME. TOUS DROITS RÉSERVÉS. Propriétaire: M,sem's.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-accent transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-accent transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
