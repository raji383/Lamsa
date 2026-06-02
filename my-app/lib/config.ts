export const SITE_CONFIG = {
  name: 'Lamsa',
  tagline: 'Elegance in Every Touch',
  description: 'Premium, elegant fashion designed for the modern Moroccan woman',
  
  // Brand Colors
  colors: {
    primary: '#1A1A1A',
    secondary: '#A39E93',
    accent: '#D4AF37',
    beige: '#F5F1ED',
    white: '#FFFFFF',
    border: '#E8E3DE',
  },

  // Contact Information
  contact: {
    phone: '+212 6 12 34 56 78',
    email: 'hello@lamsa.com',
    whatsapp: 'https://wa.me/212612345678',
    address: 'Casablanca, Morocco',
  },

  // Social Media
  social: {
    instagram: 'https://instagram.com/lamsafashion',
    facebook: 'https://facebook.com/lamsafashion',
    twitter: 'https://twitter.com/lamsafashion',
  },

  // Shipping
  shipping: {
    freeShippingThreshold: 500, // DH
    standardShippingCost: 50, // DH
    shippingDays: [2, 5], // 2-5 business days
  },

  // Tax
  tax: {
    rate: 0.1, // 10%
  },

  // Product Categories
  categories: [
    { id: '1', name: 'Home Dresses', slug: 'home-dresses' },
    { id: '2', name: 'Elegant Dresses', slug: 'dresses' },
    { id: '3', name: 'Lounge Wear', slug: 'lounge' },
    { id: '4', name: 'Pyjamas', slug: 'pyjamas' },
    { id: '5', name: 'Accessories', slug: 'accessories' },
  ],

  // Return Policy
  returnPolicy: {
    days: 30,
    condition: 'Original condition with all tags attached',
  },
};

export const APP_ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: '/admin',
};
