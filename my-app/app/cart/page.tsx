'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Elegant Beige Caftan',
      price: 599,
      quantity: 1,
      size: 'M',
      color: 'Beige',
      image: 'https://images.unsplash.com/photo-1595777707802-07b1d700c47f?w=300&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Silk Luxury Pyjamas',
      price: 399,
      quantity: 1,
      size: 'L',
      color: 'White',
      image: 'https://images.unsplash.com/photo-1623619324429-efc2c41c1b50?w=300&h=300&fit=crop',
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="container-lamsa py-4 border-b border-gray-200">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Shopping Cart</span>
        </nav>
      </div>

      <div className="container-lamsa section-spacing">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-light mb-8 tracking-tight">Shopping Cart</h1>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-200">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-lg font-medium hover:underline line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <p>
                          Color: <span className="font-medium">{item.color}</span>
                        </p>
                        <p>
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-lg font-semibold">{item.price * item.quantity} DH</div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link href="/shop" className="btn-secondary mt-8">
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
                <h2 className="text-xl font-light mb-6 tracking-tight">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `${shipping.toFixed(2)} DH`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>{tax.toFixed(2)} DH</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} DH</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Free shipping on orders over 500 DH
                  </p>
                )}

                <Link href="/checkout" className="btn-primary w-full mb-3">
                  Proceed to Checkout
                </Link>

                <a
                  href={`https://wa.me/212612345678?text=I have ${cartItems.length} items in my cart. Total: ${total.toFixed(2)} DH`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white px-8 py-3 hover:bg-green-600 transition-colors duration-300 font-medium tracking-wide text-center block"
                >
                  💬 Order via WhatsApp
                </a>

                {/* Apply Coupon */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-semibold mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="input-field flex-1 text-sm"
                    />
                    <button className="btn-secondary text-sm">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h1 className="text-3xl font-light mb-4 tracking-tight">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md text-center">
              Discover our collection of elegant fashion and add items to your cart.
            </p>
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
