"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, getPrimaryImage, getProductPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <h1 className="text-4xl font-serif text-brand-dark mb-12 text-center">
          Your Bag
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-taupe mb-8">Your bag is empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-brand-dark text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {items.map((item) => {
                const price =
                  item.variant?.price_override ??
                  getProductPrice(item.product);
                return (
                  <div
                    key={item.id}
                    className="flex gap-6 border-b border-brand-beige pb-8"
                  >
                    <div className="relative h-32 w-24 flex-shrink-0 bg-brand-light">
                      <Image
                        src={getPrimaryImage(item.product.images)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-serif text-lg hover:text-brand-gold"
                      >
                        {item.product.name}
                      </Link>
                      {(item.variant?.size || item.variant?.color) && (
                        <p className="text-sm text-brand-taupe mt-1">
                          {[item.variant?.size, item.variant?.color]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      <p className="text-brand-gold mt-2">
                        {formatPrice(price)}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="inline-flex items-center border border-brand-beige">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-2"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-brand-taupe hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-brand-light p-8 h-fit">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-6 text-brand-taupe">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t border-brand-beige pt-4 mb-8">
                <span>Total</span>
                <span className="text-brand-gold">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-center bg-brand-dark text-white py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
              >
                Checkout — Cash on Delivery
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
