# Lamsa Backend Integration Guide

## Overview

This guide helps backend developers integrate their API with the Lamsa frontend.

## Frontend Expectations

The frontend is built to work with a RESTful API on port 3001.

### Base URL
```
http://localhost:3001 (development)
https://api.lamsa.com (production)
```

Configure via `NEXT_PUBLIC_API_URL` environment variable.

## API Endpoints Required

### 1. Products Endpoints

#### Get All Products
```
GET /api/products?category=dresses&color=beige&minPrice=100&maxPrice=1000&sort=newest
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Elegant Beige Caftan",
      "price": 599,
      "originalPrice": 799,
      "image": "https://...",
      "category": "Dresses",
      "rating": 4.5,
      "reviews": 32,
      "colors": ["Beige", "Taupe"],
      "sizes": ["XS", "S", "M", "L", "XL"],
      "stock": 45,
      "isFeatured": true,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

#### Get Product Details
```
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Elegant Beige Caftan",
    "description": "...",
    "price": 599,
    "images": ["https://...", "https://..."],
    "colors": ["Beige", "Taupe"],
    "sizes": ["XS", "S", "M", "L", "XL"],
    "rating": 4.5,
    "reviews": 32,
    "stock": 45,
    "sku": "CAFTAN-BEIGE-001"
  }
}
```

### 2. Orders Endpoints

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerPhone": "+212612345678",
  "customerName": "Fatima Ahmed",
  "shippingAddress": "123 Main St",
  "shippingCity": "Casablanca",
  "shippingPostalCode": "20000",
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "selectedColor": "Beige",
      "selectedSize": "M"
    }
  ],
  "subtotal": 1198,
  "shippingCost": 0,
  "taxAmount": 119.8,
  "totalAmount": 1317.8,
  "paymentMethod": "cash_on_delivery",
  "notes": "Please deliver after 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "orderNumber": "LAMSA-2024-001234",
    "status": "pending",
    "totalAmount": 1317.8,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

#### Get Orders
```
GET /api/orders?status=pending&limit=20
Authorization: Bearer {token}
```

#### Update Order Status
```
PUT /api/orders/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "shipped"
}
```

### 3. Cart Endpoints

#### Add to Cart
```
POST /api/cart/add
Content-Type: application/json

{
  "sessionId": "guest-session-123",
  "productId": "...",
  "quantity": 1,
  "selectedColor": "Beige",
  "selectedSize": "M"
}
```

#### Get Cart
```
GET /api/cart/:sessionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "productId": "...",
        "name": "Elegant Beige Caftan",
        "price": 599,
        "quantity": 1,
        "selectedColor": "Beige",
        "selectedSize": "M"
      }
    ],
    "subtotal": 599,
    "shippingCost": 0,
    "tax": 59.9,
    "total": 658.9
  }
}
```

#### Update Cart Item
```
PUT /api/cart/:itemId
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Cart Item
```
DELETE /api/cart/:itemId
```

### 4. Authentication Endpoints

#### Admin Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@lamsa.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "email": "admin@lamsa.com",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer {token}
```

### 5. Categories Endpoints

#### Get Categories
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Dresses",
      "slug": "dresses",
      "description": "..."
    }
  ]
}
```

### 6. Newsletter Endpoints

#### Subscribe
```
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

### 7. Reviews Endpoints

#### Create Review
```
POST /api/reviews
Content-Type: application/json

{
  "productId": "...",
  "rating": 5,
  "title": "Great product!",
  "content": "Very happy with my purchase...",
  "customerName": "Fatima"
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "details": {}
  }
}
```

### Common Error Codes
- `INVALID_INPUT` - Validation error
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Resource conflict
- `SERVER_ERROR` - Server error

## Status Codes
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 409 - Conflict
- 500 - Server Error

## Authentication

All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGc...
```

Token should be stored in httpOnly cookie or localStorage on client.

## CORS Configuration

Backend should enable CORS for:
```
http://localhost:3000 (development)
https://lamsa.com (production)
```

## Rate Limiting

Recommended rate limits:
- Public endpoints: 100 requests/minute
- Auth endpoints: 10 requests/minute
- Admin endpoints: 1000 requests/minute

## Pagination

Endpoints that return lists support pagination:
```
?page=1&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

## Filtering

Product endpoints support filters:
```
?category=dresses&color=beige&minPrice=100&maxPrice=1000&sort=newest
```

Sorting options:
- `newest` - Newest first
- `popular` - Most popular first
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `rating` - Highest rated first

## File Uploads

### Product Images
```
POST /api/uploads
Content-Type: multipart/form-data

[file binary data]
```

Response:
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.lamsa.com/products/image-123.jpg"
  }
}
```

## Database Schema

The PostgreSQL schema is provided in `lib/database.sql`.

Key tables:
- `users` - Customers and admins
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `carts` - Shopping carts
- `reviews` - Product reviews
- `newsletter_subscriptions` - Newsletter subscribers

## Environment Variables

Backend should use these environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/lamsa
JWT_SECRET=your-secret-key-min-32-chars
PORT=3001
ENVIRONMENT=development
CORS_ORIGIN=http://localhost:3000
```

## Testing the API

### Using curl
```bash
# Get products
curl http://localhost:3001/api/products

# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"test@example.com",...}'
```

### Using Postman
1. Import provided Postman collection
2. Set `baseUrl` variable
3. Run requests in order
4. Verify responses

## Performance Considerations

- Implement database connection pooling
- Add query caching for products
- Use CDN for static assets
- Compress responses (gzip)
- Implement pagination for large datasets
- Add database indexes on frequently queried columns

## Security Best Practices

1. Validate all inputs
2. Use parameterized queries
3. Implement rate limiting
4. Use HTTPS in production
5. Hash passwords with bcrypt
6. Implement CORS correctly
7. Add security headers
8. Log security events
9. Keep dependencies updated
10. Regular security audits

## Documentation & Support

- API documentation: [Link]
- Bug reports: [Email]
- Feature requests: [Email]
- Technical support: [Email]

---

For questions: hello@lamsa.com
