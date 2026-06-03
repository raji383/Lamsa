import { Suspense } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ShopContent from "./ShopContent";

export const metadata = {
  title: "Shop | Lamsa",
  description: "Explore luxury Moroccan women's fashion — home dresses, loungewear, and more.",
};

export default function ShopPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="py-24 text-center">Loading collection...</div>}>
        <ShopContent />
      </Suspense>
    </PageLayout>
  );
}
