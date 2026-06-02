# Lamsa Development & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Modern code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Navigate to the app directory
cd my-app

# 2. Install dependencies
npm install

# 3. Add lucide-react for icons
npm install lucide-react

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Project Architecture

### Frontend (Next.js)
- **Location**: `my-app/`
- **Purpose**: User-facing e-commerce website
- **Tech**: Next.js 16, React 19, TypeScript, Tailwind CSS

### Backend (Go)
- **Location**: `backend/`
- **Purpose**: API server and business logic
- **Tech**: Go (main.go)

## Implementation Roadmap

### Phase 1: Frontend (✅ COMPLETE)
- [x] Design system and styling
- [x] All pages and layouts
- [x] Components (Header, Footer, ProductCard, Filters)
- [x] Shopping cart UI
- [x] Admin dashboard UI
- [x] Contact forms
- [x] WhatsApp integration links

### Phase 2: Backend Setup
- [ ] Set up Go backend server
- [ ] Configure database (PostgreSQL)
- [ ] Create database schema (SQL file provided)
- [ ] Implement authentication

### Phase 3: API Integration
- [ ] Create API endpoints for products
- [ ] Create API endpoints for orders
- [ ] Create API endpoints for cart
- [ ] Connect frontend to backend APIs

### Phase 4: Database
- [ ] Set up PostgreSQL instance
- [ ] Execute database schema
- [ ] Create database indexes
- [ ] Set up database backups

### Phase 5: Advanced Features
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Image upload and storage
- [ ] Search functionality
- [ ] Inventory management

## Backend Setup Guide

### Option 1: Go Backend (Recommended)

#### Install Go
```bash
# macOS
brew install go

# Linux
sudo apt-get install golang-go

# Windows
# Download from https://golang.org/dl/
```

#### Set up Go project
```bash
cd backend
go mod init lamsa
go get github.com/gin-gonic/gin
go get github.com/lib/pq
go get github.com/golang-jwt/jwt/v4
```

#### Create main API server
```go
// backend/main.go
package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    
    // Enable CORS for frontend
    router.Use(CORSMiddleware())
    
    // API Routes
    router.GET("/api/products", GetProducts)
    router.GET("/api/products/:id", GetProduct)
    router.POST("/api/orders", CreateOrder)
    
    router.Run(":3001")
}
```

#### Run Go backend
```bash
go run main.go
# Server will run on http://localhost:3001
```

### Option 2: Node.js Backend

If you prefer Node.js/Express:

```bash
cd backend
npm init -y
npm install express pg cors dotenv
npm install -D nodemon @types/node typescript

# Create .env file
echo "DATABASE_URL=postgresql://user:password@localhost:5432/lamsa" > .env
echo "PORT=3001" >> .env

# Run
npx ts-node server.ts
```

## Database Setup

### PostgreSQL Installation

```bash
# macOS
brew install postgresql@15

# Linux
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Initialize Database

```bash
# Create database
createdb lamsa

# Connect to database
psql lamsa

# Execute schema from lib/database.sql
\i /path/to/lib/database.sql
```

### Connection String
```
postgresql://username:password@localhost:5432/lamsa
```

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WHATSAPP_PHONE=212612345678
NEXT_PUBLIC_SITE_NAME=Lamsa
NEXT_PUBLIC_SITE_EMAIL=hello@lamsa.com
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lamsa
JWT_SECRET=your-secret-key-here-min-32-characters
PORT=3001
ENVIRONMENT=development
```

## API Endpoints Reference

### Products
```
GET    /api/products                 # Get all products
GET    /api/products/:id             # Get product by ID
POST   /api/products                 # Create product (admin)
PUT    /api/products/:id             # Update product (admin)
DELETE /api/products/:id             # Delete product (admin)
```

### Orders
```
GET    /api/orders                   # Get orders (admin)
GET    /api/orders/:id               # Get order details
POST   /api/orders                   # Create new order
PUT    /api/orders/:id/status        # Update order status (admin)
```

### Cart
```
GET    /api/cart/:sessionId          # Get cart items
POST   /api/cart/add                 # Add to cart
PUT    /api/cart/:itemId             # Update quantity
DELETE /api/cart/:itemId             # Remove from cart
```

### Authentication
```
POST   /api/auth/login               # Admin login
POST   /api/auth/logout              # Logout
GET    /api/auth/verify              # Verify token
```

## Connecting Frontend to Backend

### Update API calls in components

Example: Product fetching

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProducts(filters?: any) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  
  const response = await fetch(`${API_URL}/api/products?${params}`);
  return response.json();
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  return response.json();
}
```

### Update components to use real API

```typescript
// app/shop/page.tsx
import { getProducts } from '@/lib/api';

export default async function ShopPage() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
```

## Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard
```

### Backend Deployment

#### Heroku (Go)
```bash
heroku create lamsa-api
git push heroku main
heroku config:set DATABASE_URL=your-db-url
```

#### Railway
```bash
railway login
railway link
railway deploy
```

## Testing

### Frontend Testing
```bash
npm run test          # Run tests
npm run test:watch   # Watch mode
```

### Backend Testing
```bash
go test ./...        # Run all tests
go test -v ./...     # Verbose output
```

## Monitoring & Logging

### Frontend
- Use Sentry for error tracking
- Google Analytics for user behavior
- Vercel Analytics for performance

### Backend
- Use Winston or similar for logging
- Monitor database queries
- Set up error alerts

## Common Issues & Solutions

### CORS Errors
- Ensure backend has CORS middleware enabled
- Check frontend API URL matches backend server

### Database Connection
- Verify PostgreSQL is running
- Check connection string
- Ensure database exists

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `tsc --noEmit`

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Compress images before upload

### Database Optimization
- Add indexes to frequently queried columns
- Use pagination for large result sets
- Cache frequently accessed data

### Frontend Optimization
- Code splitting and dynamic imports
- Minify and compress assets
- Use CDN for static files

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use parameterized queries
- [ ] Implement CORS properly
- [ ] Secure admin authentication
- [ ] Encrypt sensitive data
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies
- Backup database
- Review security logs
- Optimize performance

### Quarterly Reviews
- Code quality assessment
- Performance audit
- Security review
- User feedback analysis

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Go Docs: https://golang.org/doc
- PostgreSQL Docs: https://www.postgresql.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

For questions or issues, contact: hello@lamsa.com
