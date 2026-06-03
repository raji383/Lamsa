"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Beige", hex: "#E7D7C9" },
  { name: "Taupe", hex: "#B8A99A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gold", hex: "#D4B483" },
  { name: "Black", hex: "#2C2A29" },
];

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/shop?${next.toString()}`);
  };

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Search</h3>
        <input
          type="search"
          placeholder="Search collection..."
          defaultValue={params.get("search") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("search", (e.target as HTMLInputElement).value || null);
            }
          }}
          className="w-full border border-brand-beige px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
        />
      </div>

      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Category</h3>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => update("category", null)}
              className={`text-sm ${!params.get("category") ? "text-brand-gold" : "text-brand-taupe hover:text-brand-dark"}`}
            >
              All
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => update("category", c.slug)}
                className={`text-sm ${params.get("category") === c.slug ? "text-brand-gold" : "text-brand-taupe hover:text-brand-dark"}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                update("size", params.get("size") === s ? null : s)
              }
              className={`min-w-[2.5rem] px-2 py-1 text-xs border ${
                params.get("size") === s
                  ? "border-brand-gold bg-brand-gold text-white"
                  : "border-brand-beige hover:border-brand-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() =>
                update("color", params.get("color") === c.name ? null : c.name)
              }
              className={`h-8 w-8 rounded-full border-2 ${
                params.get("color") === c.name
                  ? "border-brand-gold ring-2 ring-brand-gold ring-offset-2"
                  : "border-brand-beige"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Price (MAD)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={params.get("min_price") ?? ""}
            className="w-full border border-brand-beige px-3 py-2 text-sm"
            onBlur={(e) => update("min_price", e.target.value || null)}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={params.get("max_price") ?? ""}
            className="w-full border border-brand-beige px-3 py-2 text-sm"
            onBlur={(e) => update("max_price", e.target.value || null)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg text-brand-dark mb-4">Sort</h3>
        <select
          value={params.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full border border-brand-beige px-4 py-2 text-sm bg-white focus:border-brand-gold focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
