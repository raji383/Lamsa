import Image from "next/image";
import PageLayout from "@/components/layout/PageLayout";
import { fetchPublicSettings } from "@/lib/api";

export const metadata = {
  title: "About | Lamsa",
  description: "The story behind Lamsa — Moroccan craftsmanship and modern elegance.",
};

export default async function AboutPage() {
  const settings: Record<string, string> =
    (await fetchPublicSettings().catch(() => ({}))) as Record<string, string>;

  const values = [
    {
      title: "Craftsmanship",
      text: "Every stitch reflects Moroccan artisan heritage and contemporary precision.",
    },
    {
      title: "Modesty & Grace",
      text: "Designs that honour tradition while celebrating the confident modern woman.",
    },
    {
      title: "Comfort",
      text: "Luxury you can live in — from morning coffee to evening gatherings at home.",
    },
    {
      title: "Trust",
      text: "Transparent pricing, honest materials, and personal service via WhatsApp.",
    },
  ];

  return (
    <PageLayout>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=2000"
          alt="Lamsa craftsmanship"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-5xl md:text-6xl font-serif text-white">
          Our Story
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-brand-taupe leading-relaxed">
          {settings.about_story ||
            "Lamsa was born from a passion for blending traditional Moroccan artistry with contemporary fashion."}
        </p>
      </section>

      <section className="bg-brand-light py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">Mission</h2>
            <p className="text-brand-taupe leading-relaxed">
              {settings.about_mission ||
                "To empower Moroccan women with elegant, comfortable, and affordable luxury fashion."}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-serif text-brand-dark mb-4">Vision</h2>
            <p className="text-brand-taupe leading-relaxed">
              {settings.about_vision ||
                "To become the leading Moroccan women's fashion brand, celebrated for quality and elegance."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-center text-brand-dark mb-16">
          Our Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="text-center p-8 border border-brand-beige/50 hover:border-brand-gold transition-colors"
            >
              <h3 className="font-serif text-xl text-brand-gold mb-4">
                {v.title}
              </h3>
              <p className="text-sm text-brand-taupe leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-dark text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-serif mb-6">Moroccan Inspiration</h2>
        <p className="max-w-2xl mx-auto text-gray-300 leading-relaxed">
          From the soft light of riad courtyards to the textures of handwoven
          linens, Lamsa draws on Morocco&apos;s rich visual language — reimagined
          for the woman who values both heritage and modernity.
        </p>
      </section>
    </PageLayout>
  );
}
