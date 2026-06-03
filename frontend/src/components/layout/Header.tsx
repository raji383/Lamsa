"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-brand-dark hover:bg-brand-beige/20 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-3xl font-bold tracking-tight text-brand-dark transition-colors group-hover:text-brand-gold">
                Lamsa
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:gap-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide text-brand-dark hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
            <button className="text-brand-dark hover:text-brand-gold transition-colors hidden sm:block">
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="text-brand-dark hover:text-brand-gold transition-colors hidden sm:block">
              <span className="sr-only">Account</span>
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="relative text-brand-dark hover:text-brand-gold transition-colors group">
              <span className="sr-only">Cart</span>
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-white shadow-sm transition-transform group-hover:scale-110">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-lg border-t border-brand-beige/30 py-4">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-brand-dark hover:bg-brand-beige/10 hover:text-brand-gold"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
