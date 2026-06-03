# Lamsa REST API Specification

Base URL: `{API_HOST}/api`

All JSON responses use:

```json
{ "success": true, "data": { ... } }
```

Paginated lists add: `total`, `page`, `per_page`, `total_pages`.

Errors: `{ "success": false, "error": "message" }`

---

## Public

### Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/settings/public` | Public site settings (WhatsApp, hero, social, about) |

### Products

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/products` | `search`, `category_id`, `sort`, `page`, `per_page`, `min_price`, `max_price`, `featured`, `best_seller`, `new_arrival` | List published products |
| GET | `/products/{idOrSlug}` | — | Product detail with images & variants |

**Sort values:** `newest`, `best-selling`, `price-asc`, `price-desc`

### Categories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | Active categories |
| GET | `/categories/{id}` | Category by ID |

### Reviews

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products/{id}/reviews` | Approved reviews |
| POST | `/reviews` | Submit review (pending approval) |

### Orders

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/orders` | See below | Create COD order |

```json
{
  "customer_name": "string",
  "customer_phone": "string",
  "customer_city": "string",
  "customer_address": "string",
  "notes": "optional",
  "items": [
    { "product_id": "uuid", "variant_id": 1, "quantity": 2 }
  ]
}
```

### Newsletter

| Method | Path | Body |
|--------|------|------|
| POST | `/newsletter/subscribe` | `{ "email": "..." }` |

---

## Admin Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin/login` | `{ "email", "password" }` → `access_token`, `user`, refresh cookie |
| POST | `/admin/logout` | Revoke refresh token |
| POST | `/admin/refresh-token` | New access token (cookie) |
| GET | `/admin/me` | Current user (Bearer token) |

**Roles:** `super_admin`, `admin`, `staff`

---

## Admin (Bearer `Authorization: token`)

### Dashboard

| GET | `/admin/dashboard/stats` | Stats + recent orders |

### Products

| GET | `/admin/products` | List all (incl. drafts) |
| GET | `/admin/products/{id}` | Detail |
| POST | `/admin/products` | Create |
| PUT | `/admin/products/{id}` | Update |
| DELETE | `/admin/products/{id}` | Delete |
| POST | `/admin/products/{id}/variants` | Add variant |
| DELETE | `/admin/products/{id}/variants/{variantId}` | Remove variant |
| POST | `/admin/products/{id}/images` | Add image URL |
| DELETE | `/admin/products/{id}/images/{imageId}` | Remove image |

### Categories

| GET/POST | `/admin/categories` |
| PUT/DELETE | `/admin/categories/{id}` |

### Orders

| GET | `/admin/orders` | `status`, `search`, `source`, pagination |
| GET | `/admin/orders/{id}` | Full order + history |
| PATCH | `/admin/orders/{id}/status` | `{ "status", "note" }` |

**Statuses:** `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

### Reviews

| GET | `/admin/reviews` |
| PATCH | `/admin/reviews/{id}/status` | `{ "status": "approved|rejected|pending" }` |
| DELETE | `/admin/reviews/{id}` |

### Customers

| GET | `/admin/customers` | `search`, pagination |

### Settings

| GET | `/admin/settings` | All key-value settings |
| PUT | `/admin/settings` | `{ "whatsapp_number": "...", ... }` bulk update |

---

## Security

- JWT access tokens (short-lived)
- HttpOnly refresh cookies on `/api/admin`
- bcrypt password hashing
- RBAC on admin routes
- Parameterized SQL (pgx)
- Security headers middleware
- CORS configurable via env
