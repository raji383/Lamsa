import { notFound } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import ProductDetail from "@/components/products/ProductDetail";
import { fetchProduct, fetchProducts, fetchPublicSettings } from "@/lib/api";
import { SITE_URL } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await fetchProduct(slug);
    return {
      title: `${product.name} | Lamsa`,
      description: product.description ?? product.meta_description,
      openGraph: {
        title: product.name,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
      alternates: { canonical: `${SITE_URL}/product/${slug}` },
    };
  } catch {
    return { title: "Product | Lamsa" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  let settings: Record<string, string> = {};
  try {
    [product, settings] = await Promise.all([
      fetchProduct(slug),
      fetchPublicSettings(),
    ]);
  } catch {
    notFound();
  }

  let related: Awaited<ReturnType<typeof fetchProducts>>["data"] = [];
  try {
    const res = await fetchProducts({
      category_id: product.category_id,
      per_page: 4,
    });
    related = (res.data ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  } catch {
    related = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.sale_price ?? product.base_price,
      priceCurrency: product.currency,
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={product}
        whatsappNumber={settings.whatsapp_number ?? "212600000000"}
        related={related}
      />
    </PageLayout>
  );
}
