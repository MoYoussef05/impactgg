## Impact GG – Rize.GG Hiring Challenge Project

Impact GG is a small esports prototype built by **Moe Youssef** as the **“find a real problem in esports and build a small app that solves it”** challenge for **Rize.GG**.

The core idea: **players and coaches don’t have a focused, credibility-first place to showcase their achievements, coaching offers, and written guides.** Today this is fragmented across Discord servers, spreadsheets, Twitter/X posts, and ad‑hoc Google Docs, which makes it hard to:

- Quickly evaluate if a coach is legit.
- Discover new players and creators worth following.
- Centralize guides, VOD notes, and achievements in one profile.

Impact GG is a thin vertical slice exploring how a **profile + coaching + guides hub** could look and feel.

For more context on the product thinking, tradeoffs, and what I’d build next, see [`BUILDLOG.md`](./BUILDLOG.md).

---

## Problem & Scope

- **Problem**: Esports players/coaches and aspiring talent struggle with **discoverability and credibility**. Information is scattered and ephemeral (Discord, DMs, private docs), and it’s hard for teams or students to quickly understand who someone is, what they’ve accomplished, and what they offer.
- **Goal of this prototype**: Provide a simple environment where:
  - Users can be **discovered** via a searchable directory.
  - Coaches can publish **coaching offers** with clear pricing and game context.
  - Creators can publish **guides** tied to their profile.
- **Deliberate constraints**:
  - No payments or scheduling flows.
  - No full onboarding funnel or moderation system.
  - Focus on a few flows that show how I **think, scope, and execute**.

---

## Tech Stack

**Core stack**

- **Next.js 16** (App Router, `src/app`) for routing and API routes.
- **React 19** with **TypeScript**.
- **PostgreSQL + Prisma** (`@prisma/client`, `@prisma/adapter-pg`) for data modeling and persistence.
- **Better Auth** for authentication and sessions.
- **TanStack Query** (`@tanstack/react-query`) for client-side data fetching, caching, and status handling.
- **Nuqs** for URL‑synchronized search/filter state.

**UI & UX**

- **Tailwind CSS 4** and **shadcn/ui** component primitives.
- **next-themes** for dark/light theme support.
- **Lexical** rich text editor for authoring guides.
- **sonner** for toast notifications.

**Tooling**

- **ESLint** and TypeScript for static analysis.
- **Vitest** for unit tests (see \"Testing\" below).

---

## SEO, Metadata & Routing

- **Global metadata**
  - Root layout (`src/app/layout.tsx`) defines default metadata (title template, description, Open Graph, Twitter card, favicon) with `metadataBase` set to `http://localhost:3000`.
  - Section layouts (e.g. `/(protected)/coaching/layout.tsx`, `/(protected)/discovery/layout.tsx`, `/(protected)/games/layout.tsx`, `/(protected)/guides/layout.tsx`, `/(protected)/orders/layout.tsx`) provide per-section titles that plug into the global title template.
- **Dynamic titles**
  - Profile pages (`/(protected)/u/[slug]/page.tsx`) use `generateMetadata` to set the page title from the user’s name.
  - Guide detail pages (`/(protected)/guides/[guideId]/page.tsx`) use `generateMetadata` to title the page with the guide’s title.
- **System pages & web crawlers**
  - Custom 404 at `src/app/not-found.tsx` with clear navigation back to key surfaces.
  - `src/app/robots.ts` exposes a permissive robots config pointing to the sitemap.
  - `src/app/sitemap.ts` exposes the main public URLs (currently centered around `/`).
  - `src/app/manifest.ts` defines a basic web app manifest for Impact GG (name, short name, theme colors, icons).

---

## Domain Model (High Level)

Backed by [`prisma/schema.prisma`](./prisma/schema.prisma):

- **User**
  - Core identity (name, email, avatar).
  - Relations to achievements, coaching offers, and guides.
- **Achievement**
  - Represents notable results (e.g., tournament finishes, seasonal ranks).
  - Optional game and year fields for flexible records.
- **Coaching**
  - A coach’s offer: `title`, `description`, `game`, `pricePerHour`.
  - Tied to a `user` (coach).
- **Guide**
  - Long-form content written by a user.
  - `title`, `description`, `content`, `game`.

This lets us build a **profile-first** experience where discovery, offers, and content all anchor around people.

---

## Feature Tour

All protected routes assume a signed-in user (via Better Auth).

- **Discovery**
  - Path: `/(protected)/discovery`
  - Search for users by name/email with pagination.
  - Shows counts for achievements, guides, and coaching offers per user.
  - Backed by `GET /api/discovery` with server-side pagination.

- **Coaching**
  - Path: `/(protected)/coaching`
  - Search + filter coaching offers by query and game.
  - Sort by most recent or price (asc/desc).
  - Paginated grid of coaching cards with coach info and pricing.
  - From each card, logged-in learners can open a **booking dialog** to request a session for a specific date/time and duration.
  - Backed by `GET /api/coaching` plus booking server actions.

- **Guides**
  - Paths such as `/(protected)/guides` and `/(protected)/guides/[guideId]`
  - List and view written guides.
  - Uses Lexical for rich-text content and Prisma-backed storage.
  - Backed by `GET /api/guides`.

- **User profiles**
  - Paths such as `/(protected)/u/[slug]`
  - Profile-style page for a user showing their public information and content.

- **My bookings & orders**
  - Path: `/(protected)/my-bookings` and `/(protected)/orders/learner`
  - Let learners see all of their coaching booking requests, their status, and cancel upcoming sessions.
  - Path: `/(protected)/orders/coach`
  - Gives coaches a simple dashboard to manage availability and respond to booking requests for their offers.

---

## Getting Started

### 1. Prerequisites

- **Node.js** 20+
- **PostgreSQL** database (local or hosted, e.g. Neon)
- Package manager of your choice: `npm`, `yarn`, or `pnpm`

### 2. Environment variables

Create a `.env` file in the project root and set at least:

```bash
DATABASE_URL="postgresql://user:password@host:5432/impactgg"
```

You will also need the environment variables required by **Better Auth** (for example, provider secrets, JWT/crypto secrets, etc.). These are intentionally not committed; configure them to match your local setup.

### 3. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 4. Generate Prisma client and run migrations

The Prisma client is generated into `src/generated/prisma`.

```bash
npx prisma generate
# optionally, if you maintain migrations:
# npx prisma migrate dev
```

### 5. Run the dev server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Scripts

Defined in `package.json`:

- **`npm run dev`** – Start the Next.js dev server.
- **`npm run build`** – Generate Prisma client and build the Next.js app.
- **`npm start`** – Start the production server (after `npm run build`).
- **`npm test`** – Run the Vitest test suite.

---

## Testing

This project uses **Vitest** for unit tests.

- Tests live alongside code, e.g. `src/lib/pagination.test.ts`.
- To run all tests:

```bash
npm test
```

### What is covered

- **Pagination helper** (`getPagination` in `src/lib/pagination.ts`):
  - Verifies correct `skip`/`take`/`page` for typical and boundary cases.
  - This function is central to list and search UX across APIs such as `/api/coaching`, `/api/guides`, and `/api/discovery`.

With more time, I would extend coverage to:

- Critical API endpoints (happy path + error cases).
- Form and filtering behavior at the component level (e.g., the coaching and discovery search flows).

---

## Booking Coaching (No Payments)

- **Booking model**:
  - Coaches define a recurring **availability** (day of week, time windows, time zone) from their Account page.
  - Availability uses a curated **time zone dropdown** (with an \"Other\" option for custom zones) so data is consistent but still flexible.
  - Learners can request a booking from any coaching card using a unified **calendar + time-slot picker** that only allows selecting times which fall inside the coach’s configured availability blocks.
  - Requests become `CoachingBooking` records with a status (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `COMPLETED`).
- **Coach experience**:
  - Opt into coaching via an `isCoach` toggle on the **Account** page. When enabled, the account surface reveals:
    - An **Availability** editor.
    - A **Coaching offers** manager.
    - A **Coach bookings** dashboard for incoming requests.
  - Accept or reject `PENDING` bookings; mark accepted ones as **completed** or **cancelled**.
- **Learner experience**:
  - See all requests on the **My bookings** / **Orders (learner)** views and cancel `PENDING` / `ACCEPTED` bookings.
  - Use the **Orders** entry in the sidebar to jump between learner and coach order dashboards.
- **Out-of-band coordination**:
  - Communication and payments are intentionally **out of scope** for this challenge.
  - Each booking captures contact details (email and optional Discord handle) so coaches and learners can coordinate on their preferred channels.

With more time, I’d extend coverage to:

- Critical API endpoints (happy path + error cases).
- Form and filtering behavior at the component level (e.g., the coaching and discovery search flows).

---

## Error Handling Strategy

- **API layer**
  - Each major API route (e.g. `/api/coaching`, `/api/guides`, `/api/discovery`) wraps logic in `try/catch` and returns JSON with appropriate status codes (e.g. `500` with a clear error message).
- **UI layer**
  - Pages backed by these APIs check loading and error states via TanStack Query.
  - On error, the UI surfaces a friendly message instead of crashing, and keeps the layout intact.

See `BUILDLOG.md` for more detail on tradeoffs and what I’d tighten next around error handling.

---

## Rize.GG Review Notes

- **Author**: Moe Youssef
- **Purpose**: Submission for the Rize.GG hiring challenge (“find a real problem in esports and build a small app that solves it”).
- **Focus**: Demonstrate product thinking (problem framing, scope choices), pragmatic architecture (Next.js + Prisma + Postgres), and solid baseline UX for discovery, coaching, and guides.

For a narrative walkthrough of design choices, tradeoffs, and future work, please read [`BUILDLOG.md`](./BUILDLOG.md).
