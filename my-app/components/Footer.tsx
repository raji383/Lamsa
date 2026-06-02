'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-lamsa section-spacing">
        {/* Newsletter Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 pb-16 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-light mb-4 tracking-tight">
              Elegance in Every Touch
            </h3>
            <p className="text-gray-600 max-w-md">
              Subscribe to our newsletter to receive exclusive offers, new collections, and styling tips.
            </p>
          </div>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
            {subscribed && (
              <p className="text-sm text-green-600">Thank you for subscribing!</p>
            )}
          </form>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/shop?category=dresses" className="hover:text-black transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?category=loungewear" className="hover:text-black transition-colors">
                  Lounge Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pyjamas" className="hover:text-black transition-colors">
                  Pyjamas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-black transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 tracking-wide">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@lamsa.com"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+212612345678" className="hover:text-black transition-colors">
                  +212 6 12 34 56 78
                </a>
              </div>
              <a
                href="https://wa.me/212612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-black transition-colors"
              >
                <span className="w-4 h-4">💬</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>&copy; 2024 Lamsa. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
