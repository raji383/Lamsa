# Lamsa — Premium Moroccan Women's Fashion E-Commerce

Luxury e-commerce platform for **Lamsa** — home dresses, loungewear, modest dresses, and premium pyjamas. Orders via **WhatsApp** and **Cash on Delivery**.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15+, React, TypeScript, Tailwind CSS 4, Framer Motion, Zustand |
| Backend | Go (`net/http`), Clean Architecture, pgx |
| Database | PostgreSQL 16 |
| Deploy | Docker Compose, Nginx |

## Quick Start

```bash
# Copy environment (optional)
cp .env.example .env 2>/dev/null || true

# Start all services
docker compose up --build

# Storefront: http://localhost:3000
# API: http://localhost:8080/api
# Admin: http://localhost:3000/admin/login
```

**Default admin:** `admin@lamsa.ma` / `LamsaAdmin2024!`

Configure WhatsApp and homepage content in **Admin → Settings** (no code changes).

## Project Structure

```
Lamsa/
├── backend/
│   ├── cmd/server/          # HTTP server entry
│   ├── internal/
│   │   ├── auth/            # JWT, bcrypt
│   │   ├── config/
│   │   ├── database/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── validators/
│   │   └── utils/
│   └── migrations/          # PostgreSQL schema + seeds
├── frontend/                # Next.js storefront + admin
├── nginx/
└── docker-compose.yml
```

## Documentation

- [API Specification](./docs/API_SPEC.md)
- [Implementation Roadmap](./docs/IMPLEMENTATION_ROADMAP.md)

## WhatsApp Orders

Customers click **Buy via WhatsApp** on product pages. The app builds a prefilled message and opens:

`https://wa.me/{number}?text={encoded_message}`

Set `whatsapp_number` in admin settings (digits only, e.g. `212600000000`).

## License

Proprietary — Lamsa brand.
