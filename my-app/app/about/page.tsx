'use client';

import Link from 'next/link';
import { Heart, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Quality',
      description: 'We use only premium fabrics and materials to ensure luxury and comfort.',
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description:
        'We are committed to ethical production and sustainable fashion practices.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We celebrate the modern Moroccan woman and empower through fashion.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1609644994074-5eb63079caves?w=1200&h=500&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-light tracking-wide text-white mb-4">Our Story</h1>
          <p className="text-xl text-white font-light max-w-2xl">
            Crafting elegance for the modern Moroccan woman
          </p>
        </div>
      </section>

      <div className="container-lamsa section-spacing">
        {/* Brand Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-light mb-6 tracking-tight">About Lamsa</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Lamsa was born from a vision to create elegant, modest fashion that celebrates the
              beauty and sophistication of Moroccan women. Every piece is thoughtfully designed to
              blend tradition with modernity, comfort with luxury.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              In Arabic, "Lamsa" means "touch" - reflecting our belief that fashion should touch
              the soul, enhance confidence, and express individuality. We believe that elegance
              is not about exposure, but about the artistry of design and the quality of craftsmanship.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2020, we've grown from a small atelier to a trusted brand serving women
              across Morocco and beyond. Our mission remains unchanged: to provide premium fashion
              that makes every woman feel confident, elegant, and beautiful.
            </p>
          </div>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=600&h=800&fit=crop"
              alt="Lamsa Fashion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="border-2 border-black p-8">
            <h3 className="text-2xl font-light mb-4 tracking-tight">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To design and deliver premium, elegant fashion that celebrates modest style,
              empowers women, and honors Moroccan cultural heritage. We are committed to creating
              pieces that make every woman feel confident, beautiful, and valued.
            </p>
          </div>
          <div className="border-2 border-black p-8">
            <h3 className="text-2xl font-light mb-4 tracking-tight">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the leading luxury brand for modest fashion in Morocco and the Middle East,
              recognized for our commitment to quality, sustainability, and celebrating the modern
              Moroccan woman on the global stage.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="section-title">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-black" />
                  <h4 className="text-xl font-light mb-3 tracking-tight">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="section-title">Our Journey</h2>
          <div className="space-y-8">
            {[
              { year: '2020', title: 'Founded', desc: 'Lamsa launches with our first collection' },
              { year: '2021', title: 'Growth', desc: 'Expanded to 50+ stockists across Morocco' },
              { year: '2022', title: 'Recognition', desc: 'Awarded Best Emerging Fashion Brand' },
              { year: '2023', title: 'Innovation', desc: 'Launched sustainable collection' },
              { year: '2024', title: 'Global', desc: 'International expansion begins' },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-light text-sm mb-4">
                    {item.year.slice(-2)}
                  </div>
                  {index < 4 && (
                    <div className="w-0.5 h-20 bg-gray-200" />
                  )}
                </div>
                <div className="pb-8">
                  <h4 className="text-lg font-light mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 p-12 rounded-lg mb-20">
          <h2 className="text-2xl font-light mb-8 text-center tracking-tight">Meet Our Team</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-8">
            Lamsa is built by a talented team of designers, craftspeople, and fashion enthusiasts
            who share a passion for creating beautiful, elegant pieces that empower women.
          </p>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            Every member of our team brings unique skills and perspectives, united by our shared
            commitment to quality, sustainability, and celebrating Moroccan fashion heritage.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-light mb-6 tracking-tight">
            Join Us on This Journey
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover our latest collection and become part of the Lamsa community.
          </p>
          <Link href="/shop" className="btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
