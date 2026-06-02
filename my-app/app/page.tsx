'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Star, Leaf } from 'lucide-react';

export default function Home() {
  // Sample featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'Elegant Beige Caftan',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=400&h=400&fit=crop',
      category: 'Dresses',
      rating: 5,
      reviews: 32,
    },
    {
      id: '2',
      name: 'Taupe Lounge Set',
      price: 449,
      image: 'https://images.unsplash.com/photo-1623619324429-efc2c41c1b50?w=400&h=400&fit=crop',
      category: 'Lounge Wear',
      rating: 4.5,
      reviews: 18,
    },
    {
      id: '3',
      name: 'Silk Luxury Pyjamas',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1623619324429-efc2c41c1b50?w=400&h=400&fit=crop',
      category: 'Pyjamas',
      rating: 5,
      reviews: 45,
    },
    {
      id: '4',
      name: 'White Linen Dress',
      price: 649,
      image: 'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=400&h=400&fit=crop',
      category: 'Dresses',
      rating: 4,
      reviews: 12,
    },
  ];

  const categories = [
    { name: 'Home Dresses', slug: 'home-dresses', icon: '👗' },
    { name: 'Elegant Lounge', slug: 'lounge', icon: '☕' },
    { name: 'Modest Dresses', slug: 'dresses', icon: '✨' },
    { name: 'Pyjamas', slug: 'pyjamas', icon: '🌙' },
  ];

  const testimonials = [
    {
      name: 'Fatima Ahmed',
      location: 'Casablanca',
      text: 'Absolutely love the quality and elegance of Lamsa pieces. Every item is a treasure!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Mariam Hassan',
      location: 'Marrakech',
      text: 'The perfect collection for modest fashion. Premium quality at reasonable prices.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Zainab Sultan',
      location: 'Fes',
      text: 'Lamsa understands what modern Moroccan women want. Elegant, comfortable, and stylish!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-96 bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4 max-w-4xl">
            ELEGANCE IN EVERY TOUCH
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl text-gray-200">
            Discover luxury fashion designed for the modern Moroccan woman. Modest, elegant, and timeless.
          </p>
          <Link href="/shop" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-spacing container-lamsa">
        <h2 className="section-title">Featured Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container-lamsa">
          <h2 className="section-title">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative h-48 bg-white border border-gray-200 flex flex-col items-center justify-center hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="text-center font-medium tracking-wide">{category.name}</h3>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-spacing container-lamsa">
        <h2 className="section-title">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts
            .slice()
            .reverse()
            .map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container-lamsa">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-light mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Free delivery on orders over 500 DH within Morocco
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-light mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Luxurious fabrics carefully selected for comfort and durability
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-light mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                30-day return policy for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="section-spacing container-lamsa">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Gallery Section */}
      <section className="section-spacing container-lamsa">
        <h2 className="section-title">Follow Us on Instagram</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Join our community and see how our customers style their Lamsa pieces. Tag us @lamsafashion
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={`https://images.unsplash.com/photo-${1000 + i}?w=300&h=300&fit=crop`}
                alt={`Instagram post ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white section-spacing">
        <div className="container-lamsa text-center">
          <h2 className="text-3xl font-light mb-4 tracking-tight">Ready to Elevate Your Wardrobe?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Explore our latest collection and discover the perfect pieces for every occasion.
          </p>
          <Link href="/shop" className="inline-block btn-primary">
            Discover More
          </Link>
        </div>
      </section>
    </div>
  );
}

            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
