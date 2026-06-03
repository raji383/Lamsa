import Link from "next/link";
import { Share2, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Lamsa
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Elegance in Every Touch. Discover the art of Moroccan elegance with our curated collection of luxury home dresses and loungewear.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <span className="sr-only">Instagram</span>
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <span className="sr-only">Facebook</span>
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6 text-brand-gold">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors text-sm">All Products</Link>
              </li>
              <li>
                <Link href="/category/home-dresses" className="text-gray-300 hover:text-white transition-colors text-sm">Home Dresses</Link>
              </li>
              <li>
                <Link href="/category/loungewear" className="text-gray-300 hover:text-white transition-colors text-sm">Loungewear</Link>
              </li>
              <li>
                <Link href="/category/modest-dresses" className="text-gray-300 hover:text-white transition-colors text-sm">Modest Dresses</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6 text-brand-gold">Customer Service</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact Us</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors text-sm">Returns & Exchanges</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6 text-brand-gold">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent border border-gray-600 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-dark px-4 py-2 text-sm font-medium hover:bg-white transition-colors uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Lamsa. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
