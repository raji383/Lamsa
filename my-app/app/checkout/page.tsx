'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const cartTotal = 1000; // Example total

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend to process order
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-light mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Thank you for your purchase. We've sent a confirmation email to {formData.email}
          </p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Order Number: <strong>#LAMSA-2024-001234</strong>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive updates about your order via WhatsApp and email.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
            <a
              href="https://wa.me/212612345678?text=Hi, I just placed an order. Order #LAMSA-2024-001234"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 hover:bg-green-600 transition-colors duration-300 font-medium tracking-wide"
            >
              💬 Track Order
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="container-lamsa py-4 border-b border-gray-200">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-black">
            Cart
          </Link>
          <span>/</span>
          <span className="text-black">Checkout</span>
        </nav>
      </div>

      <div className="container-lamsa section-spacing">
        <h1 className="text-3xl font-light mb-12 tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Billing Information */}
              <div>
                <h2 className="text-2xl font-light mb-6 tracking-tight">Billing Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Fatima"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Ahmed"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-light mb-6 tracking-tight">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="fatima@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="+212 612 34 56 78"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-light mb-6 tracking-tight">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Casablanca"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="20000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-light mb-6 tracking-tight">Payment Method</h2>
                <div className="border-2 border-black p-6 rounded-lg bg-black text-white">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      name="payment"
                      value="cash"
                      defaultChecked
                      className="w-4 h-4 mr-3"
                    />
                    <label htmlFor="cash" className="cursor-pointer flex-1">
                      <div className="font-semibold">Cash on Delivery</div>
                      <p className="text-sm text-gray-200 mt-1">
                        Pay when your order arrives. Available in selected areas.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <h2 className="text-2xl font-light mb-6 tracking-tight">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input-field h-24"
                  placeholder="Any special instructions for delivery..."
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
              <h2 className="text-xl font-light mb-6 tracking-tight">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {/* Sample items */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-sm">Elegant Beige Caftan</p>
                    <p className="text-xs text-gray-600">Size M, Color Beige</p>
                    <p className="text-xs text-gray-600 mt-1">Quantity: 1</p>
                  </div>
                  <span className="font-semibold">599 DH</span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Silk Luxury Pyjamas</p>
                    <p className="text-xs text-gray-600">Size L, Color White</p>
                    <p className="text-xs text-gray-600 mt-1">Quantity: 1</p>
                  </div>
                  <span className="font-semibold">399 DH</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>998 DH</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>99.80 DH</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>1,097.80 DH</span>
                </div>
              </div>

              {/* Information Cards */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">🚚 Delivery Time</p>
                  <p className="text-gray-600">2-5 business days</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">🔒 Secure Checkout</p>
                  <p className="text-gray-600">Your information is safe with us</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">📞 Need Help?</p>
                  <p className="text-gray-600">Contact us via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
