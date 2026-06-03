"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const token = useAuthStore((s) => s.token)!;
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    base_price: 499,
    is_published: true,
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: false,
  });

  const load = () => {
    adminRequest<{ data: Product[] }>("/admin/products?per_page=100", token)
      .then((res) => setProducts(res.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [token]);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminRequest("/admin/products", token, {
      method: "POST",
      body: JSON.stringify(form),
    });
    setShowForm(false);
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminRequest(`/admin/products/${id}`, token, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} products</p>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-brand-gold"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createProduct}
          className="bg-white p-6 border mb-6 space-y-4"
        >
          <input
            placeholder="Product name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-4 py-2"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border px-4 py-2"
          />
          <input
            type="number"
            value={form.base_price}
            onChange={(e) =>
              setForm({ ...form, base_price: Number(e.target.value) })
            }
            className="w-full border px-4 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            Published
          </label>
          <button
            type="submit"
            className="bg-brand-gold text-brand-dark px-6 py-2 text-sm uppercase"
          >
            Save
          </button>
        </form>
      )}

      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Flags</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{formatPrice(p.base_price)}</td>
                <td className="p-4">
                  {p.is_published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-gray-400">Draft</span>
                  )}
                </td>
                <td className="p-4 text-xs text-gray-500">
                  {[p.is_featured && "Featured", p.is_best_seller && "Best", p.is_new_arrival && "New"]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <Link
                    href={`/product/${p.slug}`}
                    className="p-2 hover:bg-gray-100"
                    target="_blank"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
