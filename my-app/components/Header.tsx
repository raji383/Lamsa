'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200">
      <div className="container-lamsa">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-3xl font-light tracking-widest">
            LAMSA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/shop" className="text-sm tracking-wide hover:text-gray-600 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm tracking-wide hover:text-gray-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm tracking-wide hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="hidden sm:block p-2 hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-50 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/admin" className="p-2 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-3">
            <Link
              href="/shop"
              className="block text-sm tracking-wide py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-sm tracking-wide py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-sm tracking-wide py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
