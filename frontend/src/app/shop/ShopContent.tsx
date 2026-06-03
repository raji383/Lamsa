"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts, fetchCategories } from "@/lib/api";
import type { Product, Category } from "@/types";
import ShopFilters from "@/components/products/ShopFilters";
import ProductGrid from "@/components/products/ProductGrid";

const SORT_MAP: Record<string, string> = {
  newest: "newest",
  "best-selling": "best-selling",
  "price-asc": "price-asc",
  "price-desc": "price-desc",
};

export default function ShopContent() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const cats = await fetchCategories().catch(() => []);
    setCategories(cats);

    const categorySlug = params.get("category");
    const cat = cats.find((c) => c.slug === categorySlug);

    const sort = SORT_MAP[params.get("sort") ?? ""] ?? "newest";

    try {
      const res = await fetchProducts({
        search: params.get("search") ?? undefined,
        category_id: cat?.id,
        sort,
        page,
        per_page: 12,
        min_price: params.get("min_price")
          ? Number(params.get("min_price"))
          : undefined,
        max_price: params.get("max_price")
          ? Number(params.get("max_price"))
          : undefined,
      });
      let list = res.data ?? [];
      const size = params.get("size");
      const color = params.get("color");
      if (size || color) {
        list = list.filter((p) =>
          p.variants?.some(
            (v) =>
              (!size || v.size === size) && (!color || v.color === color)
          )
        );
      }
      setProducts(list);
      setTotalPages(res.total_pages ?? 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params, page]);

  useEffect(() => {
    setPage(1);
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4">
          The Collection
        </h1>
        <p className="text-brand-taupe max-w-xl mx-auto">
          Curated pieces for the modern Moroccan woman — refined, comfortable,
          unmistakably Lamsa.
        </p>
        <div className="h-0.5 w-16 bg-brand-gold mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <ShopFilters categories={categories} />
        </div>
        <div className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-6 py-2 border border-brand-beige text-sm uppercase tracking-wider disabled:opacity-40 hover:border-brand-gold"
              >
                Previous
              </button>
              <span className="py-2 text-sm text-brand-taupe">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 border border-brand-beige text-sm uppercase tracking-wider disabled:opacity-40 hover:border-brand-gold"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
