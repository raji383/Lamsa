'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Share2, Truck, RotateCcw, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Sample products for related items
const allProducts = [
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
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Beige');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Sample product data - in real app, fetch from API
  const product = {
    id: params.id,
    name: 'Elegant Beige Caftan',
    price: 599,
    originalPrice: 799,
    rating: 5,
    reviews: 32,
    images: [
      'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574802394282-e377aedb0f84?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=600&h=800&fit=crop',
    ],
    description:
      'Our signature Elegant Beige Caftan is the epitome of luxury and comfort. Crafted from premium Egyptian cotton with subtle gold embroidery, this piece is perfect for everyday elegance or special occasions. The flowing silhouette flatters all body types while maintaining the modest aesthetic we pride ourselves on.',
    details: [
      'Premium Egyptian cotton blend',
      'Hand-stitched gold embroidery',
      'Available in 5 sizes (XS-XXL)',
      'Machine washable',
      'Matching belt included',
      'Free shipping on orders over 500 DH',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'Taupe', 'White', 'Navy'],
    inStock: true,
    sku: 'CAFTAN-BEIGE-001',
  };

  const customerReviews = [
    {
      name: 'Amina K.',
      rating: 5,
      date: '2024-01-15',
      title: 'Perfect Quality!',
      text: 'This caftan is exactly what I was looking for. The quality is excellent and the fit is perfect. Will definitely order again!',
      verified: true,
    },
    {
      name: 'Nadia M.',
      rating: 5,
      date: '2024-01-10',
      title: 'Luxury at a Fair Price',
      text: 'Amazing piece! The embroidery is beautiful and the fabric is so comfortable. Highly recommend!',
      verified: true,
    },
    {
      name: 'Yasmin H.',
      rating: 4,
      date: '2024-01-05',
      title: 'Great Purchase',
      text: 'Very happy with my purchase. Slightly loose but perfect for lounging. Customer service was excellent.',
      verified: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="container-lamsa py-4 border-b border-gray-200">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="container-lamsa section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="mb-4 bg-gray-100 aspect-square overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 border-2 overflow-hidden hover:border-black transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Dresses</p>
              <h1 className="text-3xl font-light tracking-tight mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-light">{product.price} DH</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice} DH
                  </span>
                )}
              </div>
            </div>

            <div className="divider my-6" />

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wide">Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-black hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wide">Size</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-black hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <Link href="#" className="text-xs text-gray-500 hover:text-black transition-colors">
                Size Guide
              </Link>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wide">Quantity</label>
              <div className="flex items-center gap-2 w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 py-2 border border-gray-200 hover:border-black text-center"
                >
                  −
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 py-2 border border-gray-200 hover:border-black text-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full btn-primary mb-3 flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>

            {/* Buy with WhatsApp */}
            <a
              href={`https://wa.me/212612345678?text=Hi, I'm interested in the ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white px-8 py-3 hover:bg-green-600 transition-colors duration-300 font-medium tracking-wide text-center block mb-3"
            >
              💬 Buy via WhatsApp
            </a>

            {/* Wishlist and Share */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 py-3 border-2 flex items-center justify-center gap-2 transition-colors ${
                  isWishlisted
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-200 text-black hover:border-black'
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                Wishlist
              </button>
              <button className="flex-1 py-3 border-2 border-gray-200 text-black hover:border-black flex items-center justify-center gap-2 transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            <div className="divider my-6" />

            {/* Info Section */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-gray-600">On orders over 500 DH</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">30-Day Returns</p>
                  <p className="text-gray-600">Easy returns within 30 days</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="divider my-6" />
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Stock:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Reviews Tabs */}
      <section className="border-y border-gray-200">
        <div className="container-lamsa">
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-6 font-semibold text-sm uppercase tracking-wide border-b-2 -mb-px transition-colors ${
                activeTab === 'description'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-6 font-semibold text-sm uppercase tracking-wide border-b-2 -mb-px transition-colors ${
                activeTab === 'details'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-6 font-semibold text-sm uppercase tracking-wide border-b-2 -mb-px transition-colors ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="py-12">
            {activeTab === 'description' && (
              <div className="max-w-3xl prose prose-sm">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-700 leading-relaxed">
                  This piece is designed for the modern Moroccan woman who values elegance and comfort. Perfect for everyday wear or special occasions.
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <ul className="space-y-3 max-w-3xl">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-gold mt-1">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-6">Customer Reviews</h4>
                  <div className="space-y-6">
                    {customerReviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <h5 className="font-semibold mb-2">{review.title}</h5>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Form */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-lg font-semibold mb-6">Write a Review</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Rating</label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            className="text-2xl hover:text-yellow-400 text-gray-300 transition-colors"
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Title</label>
                      <input type="text" className="input-field" placeholder="Review title" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Review</label>
                      <textarea className="input-field h-24" placeholder="Share your thoughts..." />
                    </div>
                    <button type="submit" className="btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-spacing container-lamsa">
        <h2 className="section-title">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
