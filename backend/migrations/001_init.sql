-- Lamsa E-Commerce Platform - Database Schema
-- PostgreSQL 16

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ROLES
-- ============================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system access'),
    ('admin', 'Store management access'),
    ('staff', 'Limited management access');

-- ============================================
-- USERS (Admin/Staff)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    total_orders INTEGER NOT NULL DEFAULT 0,
    total_spent DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    details TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'MAD',
    sku VARCHAR(50) UNIQUE,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    total_sold INTEGER NOT NULL DEFAULT 0,
    avg_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = true;
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    public_id VARCHAR(255),
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================
-- PRODUCT VARIANTS (Size + Color combinations)
-- ============================================
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7),
    stock INTEGER NOT NULL DEFAULT 0,
    price_override DECIMAL(10, 2),
    sku VARCHAR(50) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, size, color)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_stock ON product_variants(stock) WHERE stock > 0;

-- ============================================
-- ORDERS
-- ============================================
CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);

CREATE TYPE order_source AS ENUM (
    'website',
    'whatsapp'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'pending',
    source order_source NOT NULL DEFAULT 'website',
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'MAD',
    -- Customer info snapshot
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_address TEXT NOT NULL,
    notes TEXT,
    -- Timestamps
    confirmed_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_source ON orders(source);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    size VARCHAR(20),
    color VARCHAR(50),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- ORDER STATUS HISTORY
-- ============================================
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_history_order ON order_status_history(order_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    status review_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================
-- SETTINGS (Key-Value Store)
-- ============================================
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text',
    group_name VARCHAR(50) NOT NULL DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_group ON settings(group_name);

-- Default settings
INSERT INTO settings (key, value, type, group_name, description) VALUES
    ('whatsapp_number', '212600000000', 'text', 'contact', 'WhatsApp business number'),
    ('site_name', 'Lamsa', 'text', 'general', 'Website name'),
    ('site_slogan', 'Elegance in Every Touch', 'text', 'general', 'Brand slogan'),
    ('hero_title', 'Elegance in Every Touch', 'text', 'homepage', 'Hero section title'),
    ('hero_subtitle', 'Discover the art of Moroccan elegance with our curated collection of luxury home dresses and loungewear.', 'text', 'homepage', 'Hero section subtitle'),
    ('hero_image_1', '', 'text', 'homepage', 'Hero image 1 URL'),
    ('hero_image_2', '', 'text', 'homepage', 'Hero image 2 URL'),
    ('hero_image_3', '', 'text', 'homepage', 'Hero image 3 URL'),
    ('instagram_url', 'https://instagram.com/lamsa', 'text', 'social', 'Instagram URL'),
    ('facebook_url', 'https://facebook.com/lamsa', 'text', 'social', 'Facebook URL'),
    ('tiktok_url', 'https://tiktok.com/@lamsa', 'text', 'social', 'TikTok URL'),
    ('contact_email', 'contact@lamsa.ma', 'text', 'contact', 'Contact email'),
    ('contact_phone', '+212 600 000 000', 'text', 'contact', 'Contact phone'),
    ('contact_address', 'Casablanca, Morocco', 'text', 'contact', 'Business address'),
    ('shipping_cost', '0', 'number', 'shipping', 'Default shipping cost in MAD'),
    ('free_shipping_threshold', '500', 'number', 'shipping', 'Free shipping threshold in MAD'),
    ('about_story', 'Lamsa was born from a passion for blending traditional Moroccan artistry with contemporary fashion.', 'text', 'about', 'Brand story'),
    ('about_mission', 'To empower Moroccan women with elegant, comfortable, and affordable luxury fashion.', 'text', 'about', 'Brand mission'),
    ('about_vision', 'To become the leading Moroccan women''s fashion brand, celebrated for quality and elegance.', 'text', 'about', 'Brand vision'),
    ('footer_text', '© 2024 Lamsa. All rights reserved.', 'text', 'footer', 'Footer copyright text');

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- REFRESH TOKENS
-- ============================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================
-- SEED SUPER ADMIN
-- Password: LamsaAdmin2024!
-- ============================================
INSERT INTO users (email, password_hash, first_name, last_name, role_id)
VALUES (
    'admin@lamsa.ma',
    '$2a$12$YaEI8ZzFQZU2FMGIYbxzSOFoJHJkRvDsnjc3CNoG4Qw0kM8Lsg0zu',
    'Lamsa',
    'Admin',
    1
);

-- ============================================
-- SEED CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Home Dresses', 'home-dresses', 'Elegant and comfortable home dresses', 1),
    ('Loungewear', 'loungewear', 'Luxury loungewear for the modern woman', 2),
    ('Modest Dresses', 'modest-dresses', 'Sophisticated modest dresses', 3),
    ('Pyjamas', 'pyjamas', 'Premium luxury pyjamas', 4),
    ('New Collection', 'new-collection', 'Our latest arrivals', 5);
