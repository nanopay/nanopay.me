# NanoPay.me — Technical Document

## Overview

NanoPay.me is a payment platform for the Nano cryptocurrency. Merchants create services, generate invoices, and receive real-time payment notifications via WebSockets and webhooks. Built with Next.js 15, Supabase (Postgres + Auth), and deployed on Cloudflare Workers via OpenNext.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  Browser /   │────▸│  Cloudflare      │────▸│  Supabase         │
│  Merchant    │◂────│  Workers (Next)  │◂────│  (Postgres + Auth)│
│  API Client  │     └────────┬─────────┘     └───────────────────┘
└─────────────┘              │
                   ┌─────────┴──────────┐
                   ▼                    ▼
          ┌────────────────┐   ┌────────────────┐
          │ Payment Gateway│   │ S3-Compatible  │
          │ (Nano Node)    │   │ Storage        │
          └────────────────┘   └────────────────┘
```

**Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`. Static assets served from Workers, with optional custom API domains routed through the same worker via a self-referencing service binding.

## Database Schema

All access is governed by Supabase Row-Level Security (RLS) and Column-Level Privileges. System-managed columns (e.g. `received_amount`, `status`) are read-only for users.

### Core Tables

**profiles** — User metadata linked to Supabase Auth.
| Column | Type | Notes |
|---|---|---|
| user_id | uuid | PK, FK → auth.users |
| name | text | 3–64 chars |
| email | text | |
| avatar_url | text | S3 URL |
| created_at | timestamp | |

**services** — Merchant accounts. One user can own multiple services.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| slug | text | Unique URL slug |
| name | text | 3–32 chars |
| website, contact_email | text | Optional |
| api_keys_count, invoices_count, webhooks_count | bigint | Denormalized counters |

**invoices** — Payment requests.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| service*id | uuid | FK → services |
| title | text | 2–40 chars |
| price | numeric | 0.0001–1,000,000 XNO |
| currency | text | `XNO` |
| recipient_address | text | `nano*`address |
| pay_address | text | Gateway-generated |
| metadata | jsonb | Arbitrary merchant data |
| redirect_url | text | Post-payment redirect |
| received_amount | numeric | System-managed |
| status | enum |`pending`·`paid`·`expired`·`error` |
| expires_at | timestamp | Typically 30–60 min |

**payments** — Individual Nano transactions tied to an invoice (max 10 per invoice).
| Column | Type | Notes |
|---|---|---|
| invoice_id | uuid | FK → invoices |
| hash | text | Nano block hash |
| amount | numeric | |
| amount_raws | text | Raw unit precision |
| from, to | text | Nano addresses |

**api_keys** — Merchant API credentials.
| Column | Type | Notes |
|---|---|---|
| service_id | uuid | FK → services |
| name | text | Human-readable label |
| checksum | text | BLAKE2b hash of the full key |
| scopes | text[] | Currently `['*']` |

**webhooks** — Event subscriptions.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| service_id | uuid | FK → services |
| url | text | HTTPS callback URL |
| event_types | text[] | `invoice.paid`, `invoice.created`, `invoice.error`, `invoice.expired` |
| secret | text | Optional HMAC signing key |
| active | boolean | |

**webhooks_deliveries** — Delivery log with full request/response capture.

**notifications / notifications_events** — In-app alerts for events like `INVOICE_PAID`, `INVOICE_ERROR`, `WEBHOOK_FAILURE`.

**sponsors** — Donation records linked to invoices.

### RLS Helper Functions

```sql
is_service_owner(service_id)  → session user owns the service
is_invoice_owner(invoice_id)  → session user owns the parent service
is_webhook_owner(webhook_id)  → session user owns the parent service
```

## Authentication

Handled entirely by Supabase Auth. JWTs are stored in HTTP-only cookies and renewed transparently by middleware.

**Supported methods**:

- Email + password
- GitHub OAuth
- Magic link (passwordless email)
- OTP verification

**Middleware** (`src/middleware.ts`) intercepts every request:

1. Refreshes the Supabase session from cookies.
2. Redirects unauthenticated users from protected routes to `/login?next={path}`.
3. Redirects authenticated users away from auth pages to the dashboard.
4. Rewrites requests on the custom API domain (`CUSTOM_API_DOMAIN`) to `/api/*`.

## Client Abstraction Layer

All database operations go through a service-oriented client (`src/core/client/`):

```
Client (user session)          AdminClient (service_role)
├── auth: AuthService          ├── services: ServicesService
├── user: UserService          ├── users: UsersAdminService
├── services: ServicesService  ├── invoices: InvoicesService
├── invoices: InvoicesService  ├── apiKeys: ApiKeysService
├── webhooks: WebhooksService  └── sponsors: SponsorsService
├── apiKeys: ApiKeysService
└── notifications: NotificationsService
```

`Client` is instantiated with user cookies and operates under RLS. `AdminClient` uses the `SUPABASE_SECRET_KEY` and is restricted to API routes with Bearer token validation.

Both extend `BaseService`, which provides ownership checks (`isServiceOwner`, `getServiceOwnerId`) used throughout.

## Server Actions

All internal mutations use Next.js Server Actions wrapped with `next-safe-action` and Zod validation. No REST endpoints are needed for dashboard operations.

Key actions:

| Action                                              | Purpose                                  |
| --------------------------------------------------- | ---------------------------------------- |
| `signWithPassword` / `signWithGithub`               | Login                                    |
| `signup` / `sendMagicLink` / `verifyOtp`            | Registration & verification              |
| `createService` / `updateService` / `deleteService` | Merchant management                      |
| `createInvoice`                                     | Invoice creation (calls payment gateway) |
| `createWebhook` / `updateWebhook` / `deleteWebhook` | Webhook CRUD                             |
| `createApiKey` / `deleteApiKey`                     | API key lifecycle                        |
| `getNotifications` / `archiveNotification`          | In-app notifications                     |

## Merchant REST API

Merchants authenticate with API keys (`Authorization: Bearer pk_live_...`). The server validates keys by computing `BLAKE2b(key)` and matching against the stored checksum.

| Endpoint            | Method | Description               |
| ------------------- | ------ | ------------------------- |
| `/api/service`      | GET    | Get service details       |
| `/api/invoices`     | POST   | Create an invoice         |
| `/api/invoices`     | GET    | List invoices (paginated) |
| `/api/invoices/:id` | GET    | Get invoice with payments |

Invoice creation returns `{ id, pay_url, pay_address, pay_amount, expires_at }`.

A custom API domain (`api.merchant.com`) can be configured via `CUSTOM_API_DOMAIN` — the middleware rewrites all traffic on that host to `/api/*`.

## Payment Flow

```
1. Merchant creates invoice (Server Action or API)
        │
        ▼
2. InvoicesService calls PaymentGateway.createInvoice()
   → Registers address monitoring on the Nano network
   → Returns: pay_address, expires_at
        │
        ▼
3. Payer opens payment page (/invoices/:id)
   → Displays QR code with pay_address
   → Opens WebSocket: ws://gateway/invoices/:id/payments
        │
        ▼
4. Payer sends Nano to pay_address
        │
        ▼
5. Payment Gateway detects transaction on-chain
   → Pushes payment data over WebSocket
        │
        ▼
6. Client updates UI in real-time (usePaymentsListener)
   → Tracks partial payments via usePaymentStatus (BigNumber precision)
   → On full payment: WebSocket closes with code 1000 (PAID)
        │
        ▼
7. Gateway triggers webhooks for subscribed events
   → POST to webhook URL with JSON payload
   → Signs with HMAC-SHA256 (X-NanoPay-Signature) if secret configured
   → Logs delivery in webhooks_deliveries
```

**WebSocket heartbeat**: ping every 5s, timeout after 10s, auto-reconnect on unexpected close.

**Close codes**: `1000` = paid, `4001` = expired, `4002` = max payments exceeded (10).

**Expiration**: A database function `update_status_of_expired_invoices()` marks stale invoices as `expired`.

## Real-Time & State Management

**Client-side hooks**:

- `usePaymentsListener` — WebSocket lifecycle, payment deduplication, reconnection.
- `usePaymentStatus` — Derives `amountPaid`, `amountMissing`, `isPaid`, `isPartiallyPaid` using BigNumber.
- `useNotifications` — Infinite-scroll notifications via server actions.
- `useInfiniteQuery` — Generic paginated data fetching.

**Context providers**:

- `UserProvider` — Exposes authenticated user profile.
- `PreferencesProvider` — Tracks current service (from URL slug), UI preferences.

**Server-side caching**: `unstable_cache` with tag-based revalidation (`user-{id}`, `service-{id}`, `user-{id}-services`). Cache is invalidated by server actions after mutations.

## File Storage

Avatars and images are uploaded to S3-compatible storage (Cloudflare R2, MinIO, etc.) using AWS SDK v3. Files are stored with `public-read` ACL and served via `NEXT_PUBLIC_STATIC_ASSETS_URL`.

## Price Conversion

`src/services/coinmarketcap.ts` fetches XNO/USD pricing from CoinMarketCap API (coin ID 1567) with 5-minute cache revalidation. Used for displaying fiat equivalents on payment pages.

## Routing Structure

```
/                               Landing page (public)
/login, /signup, /magic-link    Auth pages
/auth/callback                  OAuth/magic-link callback
/forgot-password                Password recovery
/change-password                Password change (protected)

/[serviceIdOrSlug]/             Dashboard (protected)
  /invoices                     Invoice management
  /webhooks                     Webhook management
  /keys                         API key management
  /settings                     Service settings
/account                        User account settings

/invoices/:id                   Public payment page
/api/...                        Merchant REST API
/docs/api                       API documentation (MDX)
/demo                           Interactive demo
/sponsors                       Sponsorship page
```

## Security

| Layer             | Mechanism                                                        |
| ----------------- | ---------------------------------------------------------------- |
| Authentication    | Supabase JWT in HTTP-only cookies, server-validated              |
| Authorization     | Postgres RLS policies enforce ownership at the database level    |
| Column security   | System columns are read-only for users (Column-Level Privileges) |
| API keys          | Stored as BLAKE2b checksums, never persisted in plain text       |
| Webhook integrity | Optional HMAC-SHA256 signatures (`X-NanoPay-Signature`)          |
| Input validation  | Zod schemas on all server actions and API routes                 |
| XSS               | React auto-escaping + sanitized rendering                        |
| SQL injection     | Supabase parameterized queries (PostgREST)                       |

## Environment Variables

| Variable                                   | Purpose                            |
| ------------------------------------------ | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                     | Application base URL               |
| `CUSTOM_API_DOMAIN`                        | Optional merchant API domain       |
| `NEXT_PUBLIC_PAYMENT_GATEWAY_URL`          | Payment gateway endpoint           |
| `PAYMENT_GATEWAY_AUTH_TOKEN`               | Gateway bearer token               |
| `SUPABASE_URL`                             | Supabase instance URL              |
| `SUPABASE_ANON_KEY`                        | Supabase public (anon) key         |
| `SUPABASE_SECRET_KEY`                      | Supabase admin key (server-only)   |
| `SUPABASE_JWT_SECRET`                      | JWT verification secret            |
| `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`    | Storage configuration              |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Storage credentials                |
| `NEXT_PUBLIC_STATIC_ASSETS_URL`            | Public CDN URL for uploads         |
| `COINMARKETCAP_API_KEY`                    | Price feed API key                 |
| `API_KEYS_SECRET`                          | HMAC secret for API key generation |
