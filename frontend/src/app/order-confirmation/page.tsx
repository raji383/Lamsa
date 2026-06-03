"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

function ConfirmationContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const total = params.get("total");

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-brand-gold mx-auto mb-8" />
      <h1 className="text-3xl font-serif text-brand-dark mb-4">
        Thank You
      </h1>
      <p className="text-brand-taupe mb-6">
        Your order has been received. Our team will contact you shortly to
        confirm delivery details.
      </p>
      {orderNumber && (
        <p className="text-lg font-medium mb-2">
          Order: <span className="text-brand-gold">{orderNumber}</span>
        </p>
      )}
      {total && (
        <p className="text-sm text-brand-taupe mb-10">
          Total: {Number(total).toLocaleString("fr-MA")} MAD (Cash on Delivery)
        </p>
      )}
      <Link
        href="/shop"
        className="inline-block bg-brand-dark text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <PageLayout>
      <Suspense>
        <ConfirmationContent />
      </Suspense>
    </PageLayout>
  );
}
