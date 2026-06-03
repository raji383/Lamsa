"use client";

import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Skeleton } from "../ui/Skeleton";

export default function ProductGrid({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] w-full mb-4" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center py-24 text-brand-taupe font-serif text-xl">
        No pieces match your selection. Refine your filters or explore our full
        collection.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
