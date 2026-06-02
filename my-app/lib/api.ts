// API routes will be connected to PostgreSQL backend
// This is the Next.js API structure

/**
 * Products API
 * - GET /api/products - Get all products with filters
 * - GET /api/products/:id - Get product details
 * - POST /api/products - Create product (admin)
 * - PUT /api/products/:id - Update product (admin)
 * - DELETE /api/products/:id - Delete product (admin)
 */

/**
 * Orders API
 * - GET /api/orders - Get orders (with auth)
 * - GET /api/orders/:id - Get order details
 * - POST /api/orders - Create order
 * - PUT /api/orders/:id - Update order status (admin)
 */

/**
 * Cart API
 * - POST /api/cart/add - Add to cart
 * - GET /api/cart - Get cart items
 * - PUT /api/cart/:id - Update cart item
 * - DELETE /api/cart/:id - Remove from cart
 */

/**
 * Auth API
 * - POST /api/auth/login - Admin login
 * - POST /api/auth/logout - Logout
 * - GET /api/auth/verify - Verify session
 */

/**
 * Upload API
 * - POST /api/upload - Upload product images
 */

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  CART: '/api/cart',
  AUTH: '/api/auth',
  UPLOAD: '/api/upload',
};
