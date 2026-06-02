# Lamsa - Luxury E-Commerce Platform

A modern, premium e-commerce website for **Lamsa**, an elegant fashion brand designed for Moroccan women.

**Brand Slogan:** *Elegance in Every Touch*

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Modern UI/UX**: Clean, minimalist design inspired by luxury brands (Zara, Massimo Dutti)
- **Fast Performance**: Optimized Next.js application with fast loading times
- **SEO Optimized**: Proper meta tags, structured data, and sitemap
- **Premium Typography**: Elegant font system using font-light for sophistication

### Pages & Sections

#### 1. Home Page (`/`)
- Full-screen hero section with elegant fashion photography
- Brand slogan: "Elegance in Every Touch"
- Featured collection showcase
- Best sellers section
- Shop by category with quick links
- Customer testimonials with ratings
- Instagram gallery integration
- Newsletter subscription form
- Benefits section (free shipping, premium quality, easy returns)
- Call-to-action section

#### 2. Shop Page (`/shop`)
- Product grid with hover effects
- Advanced filtering by:
  - Category
  - Color (Beige, Taupe, White, Gold, Black, Navy)
  - Size (XS-XXL)
  - Price range
- Sort options (newest, popular, price low-to-high, price high-to-low)
- Search functionality (to be implemented)
- Product cards with images, ratings, and prices
- Sale badges for discounted items
- Wishlist functionality

#### 3. Product Detail Page (`/product/[id]`)
- Large image gallery with thumbnails
- Product description
- Available colors and sizes
- Quantity selector
- Add to cart button
- Buy via WhatsApp button
- Customer reviews section
- Review submission form
- Related products carousel
- Product specifications and details
- Shipping and returns information

#### 4. Shopping Cart (`/cart`)
- Product list with images
- Quantity adjustment
- Remove items functionality
- Order summary with:
  - Subtotal
  - Shipping cost (free over 500 DH)
  - Tax calculation (10%)
  - Total price
- Apply coupon/promo code
- Continue shopping button
- Proceed to checkout button
- WhatsApp order option

#### 5. Checkout Page (`/checkout`)
- Customer information form
- Billing address
- Shipping address
- Payment method (Cash on Delivery)
- Order notes field
- Order summary sidebar
- Order confirmation after submission
- WhatsApp order tracking

#### 6. About Page (`/about`)
- Brand story and history
- Mission statement
- Vision statement
- Core values (Quality, Sustainability, Community)
- Company timeline/journey
- Team information
- Call-to-action for shopping

#### 7. Contact Page (`/contact`)
- Contact form (name, email, subject, message)
- Contact information cards
- WhatsApp quick chat link
- Google Maps integration
- FAQ section (6 common questions)
- Social media links
- Business hours
- Multiple contact methods

#### 8. Admin Dashboard (`/admin`)
- Admin login panel
- Dashboard overview with statistics:
  - Total orders
  - Total products
  - Total revenue
  - Total customers
- Product management
  - View all products
  - Add new products
  - Edit products
  - Delete products
  - Manage stock
- Order management
  - View all orders
  - Order status tracking
  - Order details
- Category management
- Recent orders overview

## 🎨 Design System

### Color Palette
- **Primary Black**: `#1A1A1A` - Main text and actions
- **Beige**: `#F5F1ED` - Light background
- **Taupe**: `#A39E93` - Secondary accent
- **Soft Gold**: `#D4AF37` - Premium accent
- **White**: `#FFFFFF` - Main background
- **Light Gray**: `#F9F7F4` - Secondary background

### Typography
- **Font**: Geist (modern, premium)
- **Headings**: Font-light for elegant, sophisticated appearance
- **Body**: Clear, readable sans-serif

### Components
- Custom buttons (primary, secondary, gold variants)
- Product cards with hover effects
- Filter components
- Form inputs and controls
- Modal dialogs
- Responsive grid layouts

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.6
- **React**: 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Package Manager**: npm

### Backend (To be implemented)
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **API**: RESTful API
- **Authentication**: JWT tokens
- **File Upload**: Image handling for product photos

## 📂 Project Structure

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles with design system
│   ├── shop/
│   │   └── page.tsx            # Shop/Products page
│   ├── product/
│   │   └── [id]/page.tsx       # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Shopping cart page
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/                     # API routes (to be implemented)
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer with newsletter
│   ├── ProductCard.tsx         # Product card component
│   └── ProductFilters.tsx      # Filter sidebar component
├── lib/
│   ├── api.ts                  # API configuration
│   ├── config.ts               # Site configuration
│   ├── database.sql            # PostgreSQL schema
│   └── types.ts                # TypeScript types
├── public/                       # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the application.

### Admin Panel Access

1. Navigate to `http://localhost:3000/admin`
2. Use demo credentials:
   - Email: `admin@lamsa.com`
   - Password: `password`

## 📊 Features Implemented

### ✅ Completed
- Home page with hero section and featured products
- Shop page with product grid and advanced filtering
- Product detail page with image gallery and reviews
- Shopping cart with quantity management
- Checkout process with order summary
- About page with brand story
- Contact page with contact form and FAQ
- Admin dashboard with statistics and management panels
- Responsive mobile design
- Newsletter subscription
- WhatsApp integration for orders
- Customer testimonials
- Product reviews and ratings

### ⏳ To Be Implemented (Backend)
- Product data integration from database
- Shopping cart persistence
- Order processing and management
- User authentication and accounts
- Payment processing
- Email notifications
- Product image uploads
- Search functionality
- Inventory management
- Admin user management

## 🔄 Database Schema

The PostgreSQL schema is defined in `lib/database.sql` and includes:
- Users (customers and admins)
- Products and Categories
- Orders and Order Items
- Shopping Cart
- Reviews
- Newsletter subscriptions
- Activity logs

## 📱 WhatsApp Integration

The site integrates WhatsApp for:
- Product inquiries
- Direct order placement
- Order tracking
- Customer support

Replace `212612345678` with your actual WhatsApp business number throughout the app.

## 🎯 Customization Guide

### Change Brand Information
Edit `lib/config.ts` to update:
- Brand name and tagline
- Contact information
- Social media links
- Shipping and tax rates

### Update Colors
Modify the color palette in `app/globals.css`:
- Update CSS custom properties
- Tailwind color utilities will automatically adapt

### Add Products
Currently using sample data. Connect to backend API:
1. Create API endpoints in `app/api/`
2. Update components to fetch from API
3. Connect to PostgreSQL database

## 🔐 Security Considerations

- Password hashing (bcrypt) for admin accounts
- JWT authentication for admin panel
- HTTPS enforcement in production
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📊 Performance Features

- Image lazy loading
- Code splitting and dynamic imports
- Tailwind CSS purging
- Optimized font loading
- Responsive images with next/image

## 🌍 Supported Browsers

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Support & Contact

For inquiries:
- Email: hello@lamsa.com
- Phone: +212 6 12 34 56 78
- WhatsApp: Available on contact page

---

Built with ❤️ for the modern Moroccan woman.  
*Elegance in Every Touch* ✨
