'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { ChevronDown } from 'lucide-react';

// Sample products data
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
  {
    id: '4',
    name: 'White Linen Dress',
    price: 649,
    image: 'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=400&h=400&fit=crop',
    category: 'Dresses',
    rating: 4,
    reviews: 12,
  },
  {
    id: '5',
    name: 'Gold Embroidered Dress',
    price: 799,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf049841556?w=400&h=400&fit=crop',
    category: 'Dresses',
    rating: 5,
    reviews: 28,
  },
  {
    id: '6',
    name: 'Beige Luxury Pyjamas',
    price: 449,
    image: 'https://images.unsplash.com/photo-1623619324429-efc2c41c1b50?w=400&h=400&fit=crop',
    category: 'Pyjamas',
    rating: 4.5,
    reviews: 22,
  },
  {
    id: '7',
    name: 'Taupe Midi Dress',
    price: 549,
    image: 'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=400&h=400&fit=crop',
    category: 'Dresses',
    rating: 4.5,
    reviews: 15,
  },
  {
    id: '8',
    name: 'White Home Dress',
    price: 399,
    image: 'https://images.unsplash.com/photo-1596333519201-e45006dd4e0d?w=400&h=400&fit=crop',
    category: 'Home Dresses',
    rating: 5,
    reviews: 38,
  },
  {
    id: '9',
    name: 'Beige Home Dress',
    price: 399,
    image: 'https://images.unsplash.com/photo-1596333519201-e45006dd4e0d?w=400&h=400&fit=crop',
    category: 'Home Dresses',
    rating: 4.5,
    reviews: 25,
  },
  {
    id: '10',
    name: 'Gold Silk Scarf',
    price: 199,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 5,
    reviews: 42,
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filters, setFilters] = useState({
    category: categoryParam ? [categoryParam] : [],
    color: [],
    size: [],
    priceRange: [0, 5000],
  });

  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  let filteredProducts = allProducts.filter((product) => {
    if (
      filters.category.length > 0 &&
      !filters.category.includes(product.category.toLowerCase())
    ) {
      return false;
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    return true;
  });

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      break;
    case 'newest':
    default:
      break;
  }

  return (
    <div className="container-lamsa section-spacing">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-2 tracking-tight">Shop</h1>
        <p className="text-gray-600">Explore our collection of elegant fashion</p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary text-sm"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:col-span-1`}>
          <div className="sticky top-20">
            <ProductFilters onFilterChange={setFilters} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-6">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-600 mb-4">No products found with the selected filters.</p>
              <button
                onClick={() => setFilters({ category: [], color: [], size: [], priceRange: [0, 5000] })}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-lamsa py-20">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
