'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 4.5,
  reviews = 0,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Link href={`/product/${id}`}>
      <div className="card-product group">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {originalPrice && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-medium">
              Sale
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
            <button className="btn-primary text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="card-product-info">
          <p className="text-xs text-gray-500 uppercase tracking-widest">{category}</p>
          <h3 className="text-sm font-medium text-black line-clamp-2">{name}</h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-lg font-semibold text-black">
              {price.toFixed(2)} DH
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice.toFixed(2)} DH
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
