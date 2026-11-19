# LocalTrust project documentation

## Architecture

The application uses the Next.js App Router. Public pages and interactive client components live under `src/app`; REST route handlers live in `src/app/api`. MongoDB access is centralized in `src/lib/mongodb.ts`, Mongoose schemas in `src/lib/models.ts`, and session/role checks in `src/lib/auth.ts`. `src/lib/http.ts` standardizes JSON error responses. UI primitives and discovery cards are in `src/components`.

## Data models

- **User**: identity, bcrypt password hash (excluded from normal selection), contact details, role, address and active state.
- **ProviderProfile**: user reference, service category, description, experience, structured service areas, pricing, availability/hours, portfolio URLs, verification state, rating aggregates and completed-job count. City/locality/PIN fields have an index.
- **Category**: unique name and slug, description/icon and active state. Default categories are inserted lazily by `GET /api/categories`.
- **Booking**: customer/provider references, category, date/time, requirements and state. An index supports provider/time conflict checks.
- **Review**: booking/customer/provider references, 1–5 rating and comment. `bookingId` is unique.
- **Favourite**: customer/provider references with a unique compound index.
- **Notification**: recipient, title, message and read state.

All models use Mongoose timestamps. References are stored as ObjectIds except booking category, which stores the selected category name for stable display.

## API map

| Endpoint | Methods | Access |
| --- | --- | --- |
| `/api/auth/register` | POST | Public; customer/provider signup |
| `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | POST, POST, GET | Public/current session |
| `/api/providers` | GET, PATCH | Public search; provider-owned profile update |
| `/api/providers/mine` | GET | Provider |
| `/api/providers/[id]` | GET | Public provider profile and reviews |
| `/api/categories` | GET | Public |
| `/api/bookings` | GET, POST | Authenticated; customer create, role-scoped list |
| `/api/bookings/[id]` | PATCH | Booking owner/provider/admin with valid state transition |
| `/api/reviews` | POST | Customer with completed booking |
| `/api/favourites` | GET, POST | Customer |
| `/api/admin` | GET | Admin statistics and activity |
| `/api/admin/providers/[id]` | PATCH | Admin verification decision |

Incoming API bodies are validated with Zod. Server handlers enforce role and ownership checks; client-side checks only improve navigation and feedback.

## Important workflows

### Authentication

Registration validates inputs and hashes passwords with bcryptjs. Successful login issues a seven-day HS256 JWT in a `HttpOnly`, `SameSite=Lax` cookie, secure in production. The client cannot set or inspect the cookie. `requireRole` enforces role policy at the handler boundary.

### Provider discovery and verification

Only verified providers appear in public search. Search combines the selected category, text query and structured locality/city/PIN matching, plus rating, price, availability, sort and pagination. Providers can edit business details, service area, pricing and availability in the dashboard. Profile photo/portfolio storage has no external provider configured.

### Booking and review lifecycle

Customers create requests for future dates. The API checks provider availability and blocks time slots already accepted or in progress. Providers may accept or reject pending requests, move accepted work to in-progress, then complete it. Customers may cancel pending/accepted requests. A customer can review only their completed booking; a unique index on booking prevents duplicate reviews. After insert, rating totals are recalculated from persisted reviews.

### Administration

Admins see counts and recent bookings and can verify or reject a provider application. Admin bootstrap is intentionally an operator action using the one-time promotion script, not a public signup option.

## Configuration and operations

Set `MONGODB_URI` and `AUTH_SECRET` before running. The connection utility caches the Mongoose connection and resets its promise on connection failure. Atlas access controls must permit the host/runtime. Category initialization is lazy; no fabricated provider/customer/bookings are seeded. Vercel deployment uses standard Next.js build settings and project environment variables.
