"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice, getPrimaryImage, getProductPrice } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlistStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const price = getProductPrice(product);
  const image = getPrimaryImage(product.images);
  const hasSale =
    product.sale_price != null && product.sale_price < product.base_price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-light mb-4">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        </Link>
        {product.is_new_arrival && (
          <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest text-brand-dark">
            New
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur hover:bg-brand-gold hover:text-white transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-brand-gold text-brand-gold" : ""}`}
          />
        </button>
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="block w-full bg-white/90 backdrop-blur text-brand-dark py-3 text-center text-sm font-medium tracking-wider uppercase hover:bg-brand-gold hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
      <div>
        {product.category_name && (
          <p className="text-xs uppercase tracking-widest text-brand-taupe mb-1">
            {product.category_name}
          </p>
        )}
        <h3 className="text-lg font-serif text-brand-dark mb-1">
          <Link
            href={`/product/${product.slug}`}
            className="hover:text-brand-gold transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-brand-gold font-medium">{formatPrice(price)}</p>
          {hasSale && (
            <p className="text-sm text-brand-taupe line-through">
              {formatPrice(product.base_price)}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
