"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, ProductVariant } from "@/types";
import {
  formatPrice,
  getProductPrice,
  cartItemId,
} from "@/lib/utils";
import {
  buildSingleProductMessage,
  openWhatsAppOrder,
} from "@/lib/whatsapp";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProductDetail({
  product,
  whatsappNumber,
  related,
}: {
  product: Product;
  whatsappNumber: string;
  related?: Product[];
}) {
  const images = product.images?.length
    ? [...product.images].sort(
        (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
      )
    : [
        {
          id: 0,
          product_id: product.id,
          url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1200",
          is_primary: true,
        },
      ];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  const sizes = useMemo(
    () => [...new Set(product.variants?.map((v) => v.size) ?? ["S", "M", "L"])],
    [product.variants]
  );
  const colors = useMemo(() => {
    const map = new Map<string, string>();
    product.variants?.forEach((v) => {
      if (!map.has(v.color))
        map.set(v.color, v.color_hex ?? "#E7D7C9");
    });
    if (!map.size) {
      map.set("Beige", "#E7D7C9");
      map.set("Taupe", "#B8A99A");
    }
    return map;
  }, [product.variants]);

  const selectedVariant: ProductVariant | undefined = product.variants?.find(
    (v) =>
      v.size === (selectedSize ?? sizes[0]) &&
      v.color === (selectedColor ?? [...colors.keys()][0])
  );

  const price =
    selectedVariant?.price_override ??
    getProductPrice(product);

  const handleAddToCart = () => {
    const size = selectedSize ?? sizes[0];
    const color = selectedColor ?? [...colors.keys()][0];
    const variant =
      product.variants?.find((v) => v.size === size && v.color === color) ??
      selectedVariant;

    addItem({
      id: cartItemId(product.id, variant?.id),
      product,
      variant,
      quantity,
    });
  };

  const handleWhatsApp = () => {
    const size = selectedSize ?? sizes[0];
    const color = selectedColor ?? [...colors.keys()][0];
    const message = buildSingleProductMessage({
      productName: product.name,
      size,
      color,
      quantity,
      price: price * quantity,
      currency: product.currency,
    });
    openWhatsAppOrder(whatsappNumber, message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <div
            className={`relative aspect-[3/4] bg-brand-light overflow-hidden cursor-zoom-in ${zoom ? "ring-2 ring-brand-gold" : ""}`}
            onClick={() => setZoom(!zoom)}
          >
            <Image
              src={images[activeImage].url}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${zoom ? "scale-150" : ""}`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id ?? i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-16 flex-shrink-0 border-2 ${activeImage === i ? "border-brand-gold" : "border-transparent"}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {product.category_name && (
            <p className="text-xs uppercase tracking-[0.2em] text-brand-taupe mb-2">
              {product.category_name}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-brand-gold font-medium mb-6">
            {formatPrice(price, product.currency)}
          </p>
          {product.description && (
            <p className="text-brand-taupe leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[3rem] px-4 py-2 text-sm border ${
                    (selectedSize ?? sizes[0]) === s
                      ? "border-brand-dark bg-brand-dark text-white"
                      : "border-brand-beige hover:border-brand-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest mb-3">Color</p>
            <div className="flex gap-3">
              {[...colors.entries()].map(([name, hex]) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => setSelectedColor(name)}
                  className={`h-9 w-9 rounded-full border-2 ${
                    (selectedColor ?? [...colors.keys()][0]) === name
                      ? "border-brand-gold ring-2 ring-brand-gold ring-offset-2"
                      : "border-brand-beige"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest mb-3">Quantity</p>
            <div className="inline-flex items-center border border-brand-beige">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-brand-light"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-brand-light"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-brand-dark text-white py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 border border-brand-dark text-brand-dark py-4 text-sm uppercase tracking-widest hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Buy via WhatsApp
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="p-4 border border-brand-beige hover:border-brand-gold"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-brand-gold text-brand-gold" : ""}`}
              />
            </button>
          </div>

          {product.details && (
            <div className="mt-12 pt-8 border-t border-brand-beige">
              <h2 className="font-serif text-xl mb-4">Details</h2>
              <p className="text-sm text-brand-taupe whitespace-pre-line leading-relaxed">
                {product.details}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-serif text-brand-dark mb-8">
            You May Also Love
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-brand-light mb-2 overflow-hidden">
                  <Image
                    src={
                      p.images?.[0]?.url ??
                      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="font-serif">{p.name}</p>
                <p className="text-brand-gold text-sm">
                  {formatPrice(getProductPrice(p))}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
