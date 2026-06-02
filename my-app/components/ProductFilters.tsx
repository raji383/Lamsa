'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

export default function ProductFilters({ onFilterChange }: FilterProps) {
  const [activeFilters, setActiveFilters] = useState({
    category: [] as string[],
    color: [] as string[],
    size: [] as string[],
    priceRange: [0, 5000],
  });

  const categories = ['Dresses', 'Lounge Wear', 'Pyjamas', 'Accessories', 'Home Dresses'];
  const colors = ['Beige', 'Taupe', 'White', 'Gold', 'Black', 'Navy'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleCategoryChange = (category: string) => {
    const newFilters = {
      ...activeFilters,
      category: activeFilters.category.includes(category)
        ? activeFilters.category.filter((c) => c !== category)
        : [...activeFilters.category, category],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorChange = (color: string) => {
    const newFilters = {
      ...activeFilters,
      color: activeFilters.color.includes(color)
        ? activeFilters.color.filter((c) => c !== color)
        : [...activeFilters.color, color],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const newFilters = {
      ...activeFilters,
      size: activeFilters.size.includes(size)
        ? activeFilters.size.filter((s) => s !== size)
        : [...activeFilters.size, size],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newFilters = { ...activeFilters, priceRange: [min, max] };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({
      category: [],
      color: [],
      size: [],
      priceRange: [0, 5000],
    });
    onFilterChange({
      category: [],
      color: [],
      size: [],
      priceRange: [0, 5000],
    });
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {(activeFilters.category.length > 0 ||
        activeFilters.color.length > 0 ||
        activeFilters.size.length > 0) && (
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.category.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Color</h4>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.color.includes(color)}
                onChange={() => handleColorChange(color)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`py-2 px-3 text-xs font-medium border transition-colors ${
                activeFilters.size.includes(size)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 text-gray-700 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700 block mb-2">Min: {activeFilters.priceRange[0]} DH</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={activeFilters.priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), activeFilters.priceRange[1])}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-2">Max: {activeFilters.priceRange[1]} DH</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={activeFilters.priceRange[1]}
              onChange={(e) => handlePriceChange(activeFilters.priceRange[0], parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
