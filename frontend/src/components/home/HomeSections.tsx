"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Camera } from "lucide-react";
import { motion } from "framer-motion";
import {
  fetchProducts,
  fetchCategories,
  fetchPublicSettings,
  type PublicSettings,
} from "@/lib/api";
import type { Product, Category } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import NewsletterSection from "./NewsletterSection";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=2000";

const INSTAGRAM_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1515347619362-e5fd250ceaa8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1595777453553-d042767f9527?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400",
];

export default function HomeSections() {
  const [settings, setSettings] = useState<PublicSettings>({});
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchPublicSettings().catch(() => ({})),
      fetchProducts({ featured: true, per_page: 4 }).catch(() => ({ data: [] })),
      fetchProducts({ best_seller: true, per_page: 4 }).catch(() => ({ data: [] })),
      fetchProducts({ new_arrival: true, per_page: 4 }).catch(() => ({ data: [] })),
      fetchCategories().catch(() => []),
    ]).then(([s, feat, best, neu, cats]) => {
      setSettings(s);
      setFeatured(feat.data ?? []);
      setBestSellers(best.data ?? []);
      setNewArrivals(neu.data ?? []);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const heroImage = settings.hero_image_1 || FALLBACK_HERO;
  const heroTitle = settings.hero_title || "Elegance in Every Touch";
  const heroSubtitle =
    settings.hero_subtitle ||
    "Discover the art of Moroccan elegance with our curated collection of luxury home dresses and loungewear.";

  return (
    <>
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Lamsa Collection"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <span className="text-brand-gold text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4 block">
            {settings.site_slogan || "Elegance in Every Touch"}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight whitespace-pre-line">
            {heroTitle.replace(/ in /g, " in\n")}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light">
            {heroSubtitle}
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center bg-white text-brand-dark px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-300"
          >
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {featured.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Featured Collection" href="/shop?featured=true" />
            <ProductGrid products={featured} loading={loading} />
          </div>
        </section>
      )}

      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Best Sellers" href="/shop?sort=best-selling" />
          <ProductGrid
            products={bestSellers.length ? bestSellers : featured}
            loading={loading}
          />
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="New Arrivals" href="/shop?sort=newest" />
          <ProductGrid
            products={newArrivals.length ? newArrivals : bestSellers}
            loading={loading}
          />
        </div>
      </section>

      <section className="py-24 bg-brand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
              Shop by Category
            </h2>
            <div className="h-0.5 w-16 bg-brand-gold mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(categories.length ? categories.slice(0, 3) : []).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative h-96 overflow-hidden block"
              >
                <Image
                  src={
                    cat.image_url ||
                    INSTAGRAM_PLACEHOLDERS[i % INSTAGRAM_PLACEHOLDERS.length]
                  }
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-8 py-4">
                    <h3 className="text-xl font-serif text-brand-dark">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="h-8 w-8 text-brand-gold mx-auto mb-8" />
          <h2 className="text-2xl md:text-3xl font-serif mb-12 leading-relaxed">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Sara M.",
                city: "Casablanca",
                text: "The satin home dress feels like a five-star hotel robe. Pure luxury.",
                rating: 5,
              },
              {
                name: "Nadia K.",
                city: "Rabat",
                text: "Beautiful craftsmanship and modest elegance. Lamsa understands Moroccan women.",
                rating: 5,
              },
              {
                name: "Imane B.",
                city: "Marrakech",
                text: "Ordering via WhatsApp was seamless. The team confirmed everything quickly.",
                rating: 5,
              },
            ].map((r) => (
              <blockquote
                key={r.name}
                className="border border-white/10 p-6 bg-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-brand-gold text-brand-gold"
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer className="text-brand-gold text-sm">
                  {r.name} — {r.city}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-12">
            <Camera className="h-6 w-6 text-brand-gold" />
            <h2 className="text-3xl font-serif text-brand-dark">@lamsa</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {INSTAGRAM_PLACEHOLDERS.map((src, i) => (
              <a
                key={i}
                href={settings.instagram_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
          {title}
        </h2>
        <div className="h-0.5 w-16 bg-brand-gold" />
      </div>
      <Link
        href={href}
        className="text-brand-dark hover:text-brand-gold font-medium flex items-center transition-colors text-sm uppercase tracking-wider"
      >
        View All <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}
