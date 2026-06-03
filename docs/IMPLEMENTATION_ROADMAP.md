# Lamsa Implementation Roadmap

## Phase 1 — Foundation ✅

- [x] PostgreSQL schema (users, products, orders, reviews, settings, audit)
- [x] Go API with `net/http` (no Gin/Fiber/Chi)
- [x] JWT admin auth + RBAC
- [x] Docker Compose (db, backend, frontend, nginx)
- [x] Next.js storefront shell + brand design tokens

## Phase 2 — Storefront ✅

- [x] Luxury homepage (hero, collections, best sellers, new arrivals, reviews, Instagram, newsletter)
- [x] Shop with filters, sort, pagination
- [x] Product page (gallery, zoom, variants, cart, WhatsApp)
- [x] Cart + COD checkout + confirmation
- [x] About & Contact pages
- [x] SEO: metadata, sitemap, robots.txt, JSON-LD product schema

## Phase 3 — Admin ✅

- [x] Dashboard stats & recent orders
- [x] Product CRUD (basic)
- [x] Order status management
- [x] Review approve/reject
- [x] Customer list
- [x] Settings (WhatsApp, hero, social, about) — no code deploy needed

## Phase 4 — Production Hardening (Next)

- [ ] Cloudinary upload API + admin media UI
- [ ] Rate limiting (Redis-backed)
- [ ] CSRF tokens for admin mutations
- [ ] Email notifications (order confirmation)
- [ ] Full product variant/image editor in admin
- [ ] Dashboard charts (monthly revenue series)
- [ ] Audit log viewer in admin
- [ ] E2E tests (Playwright)
- [ ] SSL certificates in nginx + production env secrets
- [ ] CDN + image optimization pipeline

## Phase 5 — Growth

- [ ] Arabic / French i18n
- [ ] Wishlist sync (account optional)
- [ ] Inventory alerts
- [ ] WhatsApp order tracking (`source: whatsapp` in orders)
- [ ] Analytics (Plausible / GA4)
- [ ] Loyalty / promo codes

## Launch Checklist

1. Change `JWT_SECRET`, `REFRESH_SECRET`, `DB_PASSWORD` in production
2. Set real `whatsapp_number` in admin settings
3. Upload hero images via Cloudinary URLs in settings
4. Seed or import full product catalog
5. Run `docker compose up -d` on VPS with domain + SSL
6. Smoke test: browse → WhatsApp order → COD checkout → admin order update
