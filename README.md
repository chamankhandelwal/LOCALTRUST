# LocalTrust

LocalTrust helps people discover and book trusted local service professionals. The project is a Next.js App Router application with MongoDB/Mongoose persistence, signed HTTP-only sessions, and server-authorized APIs.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS (v4) plus a small custom responsive design system
- MongoDB Atlas and Mongoose
- Zod validation, bcryptjs password hashing, JOSE signed sessions
- React Hook Form and Lucide React are included for future form/icon composition

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
# Set MONGODB_URI and AUTH_SECRET in .env.local
npm run dev
```

Open http://localhost:3000. A reachable MongoDB database is required for authentication, searches, and persistent workflows. `npm run build` creates the production build; `npm start` serves it.

## MongoDB Atlas

Create an Atlas cluster and database user, allow network access from your development machine and deployment environment, and copy the application connection string to `MONGODB_URI`. Use a database user with only the privileges this application needs. The connection helper caches the Mongoose connection for Next.js route reuse. Collections and indexes are created from Mongoose schemas as the routes are used. The categories endpoint inserts the default service categories on first use.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection URI |
| `AUTH_SECRET` | Yes in production | Random secret used to sign session cookies; use at least 32 random characters |
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical deployment URL for integrations |

Never commit `.env.local`. No image-upload provider is configured; provider profile images and portfolio URLs can be added after choosing a storage service.

## Accounts and admin setup

Use the registration page to create a customer or provider account. Provider accounts remain hidden from discovery until an admin verifies them. To bootstrap the first admin, register a normal account, then run this one-time command from the project folder with `MONGODB_URI` available in the shell (replace the email):

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
node scripts/promote-admin.mjs
```

Then sign in with that account and open `/admin`. Remove the shell variable afterward. The admin dashboard provides provider verification and activity counts.

## Deploy to Vercel

Import this project into Vercel, set the production `MONGODB_URI`, a fresh `AUTH_SECRET`, and optionally `NEXT_PUBLIC_APP_URL` in Project Settings → Environment Variables. Add Vercel's outbound connectivity to your Atlas network access configuration (or configure Atlas network access appropriate to your security needs), then deploy. The app uses Node.js route handlers and is compatible with the standard Next.js Vercel runtime.

## Core workflows

- Customers and providers register through `/register`; passwords use bcrypt and sessions are signed, HTTP-only, same-site cookies.
- Provider listings are searchable by service, city/locality/PIN, rating, maximum starting price, and current availability, with pagination and sorting.
- Customers request bookings; providers accept, reject, start, or complete jobs. Conflicting accepted/in-progress requests at the same provider date/time are blocked.
- Only the customer on a completed booking can review it. A unique booking index prevents a second review; provider aggregates update from persisted reviews.
- Favourites, categories, notifications, role-gated admin actions, and provider profile updates persist in MongoDB.

## Notes

No demo provider records or fake statistics are seeded. A new instance has no searchable profiles until providers register and an administrator verifies them. For locally created users, configure the initial admin as described above. See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for the architecture and API map.
