"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import { createOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_city: "",
    customer_address: "",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="py-24 text-center">
          <p className="mb-4">Your bag is empty.</p>
          <a href="/shop" className="text-brand-gold underline">
            Shop the collection
          </a>
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const order = await createOrder({
        ...form,
        items: items.map((i) => ({
          product_id: i.product.id,
          variant_id: i.variant?.id,
          quantity: i.quantity,
        })),
      });
      clearCart();
      router.push(
        `/order-confirmation?order=${order.order_number}&total=${order.total}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-4xl font-serif text-center text-brand-dark mb-4">
          Checkout
        </h1>
        <p className="text-center text-brand-taupe text-sm mb-12">
          Payment: Cash on Delivery (COD)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Full Name *
            </label>
            <input
              required
              value={form.customer_name}
              onChange={(e) =>
                setForm({ ...form, customer_name: e.target.value })
              }
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Phone Number *
            </label>
            <input
              required
              type="tel"
              value={form.customer_phone}
              onChange={(e) =>
                setForm({ ...form, customer_phone: e.target.value })
              }
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              City *
            </label>
            <input
              required
              value={form.customer_city}
              onChange={(e) =>
                setForm({ ...form, customer_city: e.target.value })
              }
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Address *
            </label>
            <textarea
              required
              rows={3}
              value={form.customer_address}
              onChange={(e) =>
                setForm({ ...form, customer_address: e.target.value })
              }
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div className="bg-brand-light p-6">
            <p className="flex justify-between font-medium">
              <span>Order Total (COD)</span>
              <span className="text-brand-gold">{formatPrice(subtotal)}</span>
            </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
