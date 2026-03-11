## BUILDLOG – Impact GG (Rize.GG Hiring Challenge)

Author: **Moe Youssef**  
Context: **“Find a real problem in esports and build a small app that solves it” – Rize.GG hiring challenge.**

---

## 1. Problem & Why It Matters

### 1.1 The problem

Esports coaches, players, and creators struggle with **discoverability and credibility**:

- Portfolios are scattered across Discord servers, Google Docs, spreadsheets, and social media.
- It’s hard to quickly evaluate whether a coach is legitimate or a player is worth investing in.
- Guides and educational content often live in random places and get lost over time.

This hurts:

- **Coaches**, who can’t clearly present their offers and track record.
- **Players / students**, who can’t easily compare coaches or find trusted guides.
- **Teams and orgs**, who need a faster way to evaluate talent.

### 1.2 The chosen slice

Instead of trying to solve the entire ecosystem, Impact GG focuses on a **thin but coherent slice**:

- A **discovery** surface for people in the ecosystem.
- **Coaching offers** attached to real profiles.
- **Guides** that live on those profiles.

The goal is not to be production-complete, but to show how I would:

- Frame the problem.
- Choose a scope that fits the challenge.
- Build a small but realistic app with good architecture and UX.

---

## 2. Options Considered

### 2.1 Product directions

I considered a few directions:

1. **Pure coaching marketplace**
   - Focus: coach listings, availability, booking, payments.
   - Pros: clear business value, concrete flows (booking, checkout).
   - Cons: heavy scope for this challenge (payments, scheduling, refunds, calendars, timezone handling).

2. **VOD review workflow tool**
   - Focus: upload/review VODs, leave annotated comments, track feedback.
   - Pros: tightly aligned with how many players learn; interesting UX (timelines, comments).
   - Cons: requires video storage, processing, and a lot of UX to feel right.

3. **Team recruitment board**
   - Focus: LFT (looking for team) and LFP (looking for player) posts, with filters and messaging.
   - Pros: very esports‑native; recruitment is a real pain.
   - Cons: messaging / notifications / moderation are significant to do well.

4. **Profile + coaching + guides hub (chosen)**
   - Focus: centralize **who you are**, **what you offer**, and **what you’ve written**.
   - Pros: Can reuse common primitives (profiles, lists, search, content); easy to expand later.
   - Cons: Does not touch payments or real‑time interactions directly.

I chose **#4** because it allows me to demonstrate:

- A realistic data model and API layer.
- Useful user flows (discovery, filtering, reading content).
- Room for future expansion into the other directions.

### 2.2 Technical architecture options

I also considered different technical stacks:

1. **SPA (React) + separate REST/Express backend**
   - Pros: very explicit separation of concerns.
   - Cons: overhead for this challenge (two deployables, extra boilerplate).

2. **Next.js App Router + API routes (chosen)**
   - Pros: co-locate UI and API logic; simple DX; good fit with Vercel-style hosting.
   - Cons: Single repo can blur separation, but manageable with clear structure.

3. **Next.js + tRPC/BFF layer**
   - Pros: typesafe end‑to‑end; great DX.
   - Cons: additional conceptual overhead for a small demonstration.

4. **Serverless functions + static frontend**
   - Pros: highly scalable; minimal backend infra.
   - Cons: overkill for a prototype; adds operational complexity.

I chose **Next.js App Router + API routes + Prisma/PostgreSQL** for a balance of:

- Familiarity for reviewers.
- Good developer experience.
- Realistic production‑like patterns.

---

## 3. Chosen Approach

### 3.1 Data model

Defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

- **User**
  - Identity fields (`id`, `name`, `email`, `image`).
  - Relations: `achievements`, `coaching`, `guides`, plus **bookings** and **availability**.
  - A boolean `isCoach` flag that gates coach-only UX (availability editor, coaching offers management, and coach bookings dashboards).
- **Achievement**
  - `type` (general/season), optional `game` and `year`, plus `description`.
- **Coaching**
  - `title`, `description`, `game`, `pricePerHour`.
  - Belongs to a `user` (coach).
  - Has many `CoachingBooking` entries.
- **Guide**
  - `title`, `description`, `content`, `game`.
  - Belongs to a `user` (author).
- **CoachingAvailability**
  - Recurring availability blocks for a coach: `dayOfWeek`, `startTime`, `endTime`, `timeZone`, optional `game`.
  - Time zones are chosen from a curated dropdown (with an \"Other\" escape hatch) to avoid free-form strings while still supporting edge cases.
  - Keeps scheduling logic simple while still realistic.
- **CoachingBooking**
  - Represents a single booking between a **learner** and a **coach** for a specific `Coaching` offer.
  - Stores `startsAt`, `endsAt`, `durationMinutes`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `COMPLETED`), and learner-provided context (`learnerNote`, email, optional Discord handle).
  - Bookings are created through a calendar + time-slot picker that only allows slots which fit inside the coach’s configured availability windows.

This model supports:

- Discovery of people with counts of their achievements, guides, and coaching offers.
- Viewing and filtering of coaching offers and guides per person.
- A **non-payment booking flow** where coaches control availability and learners can request concrete sessions, with dashboards for both sides to manage those bookings.

### 3.2 Backend

- **Next.js API routes** in `src/app/api/...`:
  - `/api/discovery` – paginated list of users, searchable by name/email.
  - `/api/coaching` – paginated list of coaching offers, filterable by query/game and sortable by price or recency.
  - `/api/guides` – paginated list of guides with optional filters.
- **Prisma** with the `@prisma/adapter-pg` adapter:
  - Connects to PostgreSQL using `DATABASE_URL`.
  - Shared Prisma client in `src/lib/prisma.ts`.
- **Pagination**:
  - Centralized helper `getPagination` in `src/lib/pagination.ts`, used across API routes.

### 3.3 Frontend

- **Routing**:
  - `src/app/(protected)/discovery/page.tsx` – user discovery.
  - `src/app/(protected)/coaching/page.tsx` – coaching offers.
  - `src/app/(protected)/guides/...` – guides lists/detail.
  - `src/app/(protected)/u/[slug]/page.tsx` – user profile pages.
- **State & data fetching**:
  - **TanStack Query** manages loading/error states and caching.
  - **Nuqs** keeps filters (search query, selected games, sort, page) synchronized with the URL.
- **UI layer**:
  - **shadcn/ui** components for cards, forms, buttons, etc.
  - Tailwind CSS utility classes for layout and styling.
  - **Lexical** for rich text guide content.
- **Metadata & SEO**:
  - Root layout (`src/app/layout.tsx`) defines global metadata, including a title template, description, Open Graph/Twitter tags, and `metadataBase`.
  - Section layouts (e.g. `/(protected)/coaching/layout.tsx`, `/(protected)/discovery/layout.tsx`, `/(protected)/games/layout.tsx`, `/(protected)/guides/layout.tsx`, `/(protected)/orders/layout.tsx`) set per-section titles that feed into the global template.
  - Dynamic routes use `generateMetadata` to keep titles meaningful:
    - Profiles (`/(protected)/u/[slug]/page.tsx`) derive the title from the user’s name.
    - Guide detail pages (`/(protected)/guides/[guideId]/page.tsx`) use the guide’s title.
  - System-level SEO surfaces:
    - `src/app/not-found.tsx` – custom 404 with clear navigation back to discovery and coaching.
    - `src/app/robots.ts` – robots configuration pointing to the sitemap.
    - `src/app/sitemap.ts` – sitemap entries for key public routes.
    - `src/app/manifest.ts` – basic PWA manifest for Impact GG.

### 3.4 Authentication

- **Better Auth** handles sign‑in, sessions, and protecting `(protected)` routes.
- Not all auth providers and flows are fully showcased in this build log, but the architecture is ready for:
  - OAuth providers.
  - Email‑based sign in / verification.
  - Enriching the session with additional user fields like `isCoach` so that client components (e.g., the sidebar and account page) can gate coach-only UX.

---

## 4. Tradeoffs

### 4.1 Scope tradeoffs

- **Included**
  - Discovery/search for users.
  - Listing and filtering coaching offers.
  - Basic guides support tied to users.
  - Basic profile surfaces.
  - A **lightweight, non-payment booking system**: availability + requests + simple status management, including dedicated views for coaches and learners.
  - A richer **calendar + time-slot booking UI** that respects coach availability when offering slots.
  - A **coach mode toggle** so that only users who opt into coaching see the full coaching and orders surfaces.
- **Excluded for now**
  - Payments, invoicing, and payout rails.
  - Calendar sync with Google/Outlook and automatic time-zone conversions.
  - Messaging or chat between users.
  - Moderation tools and reporting/flagging flows.

Rationale: Payments and deep scheduling features are significant on their own and would either require stubs or partial implementations. I chose a middle ground: enough booking flow to feel real (availability + requests + status changes, availability-aware time slots, and coach-mode-gated dashboards) while still being feasible in the challenge timeframe.

### 4.2 Performance & reliability tradeoffs

- **What I did**
  - Server‑side pagination via `getPagination` in all list endpoints.
  - Minimal `include` usage in Prisma queries to keep payloads small.
  - Basic logging of errors on the server.
- **What I did not (yet) do**
  - No Redis or in‑memory cache on top of Prisma/Postgres.
  - No rate‑limiting or WAF rules.
  - No explicit timeouts or circuit breakers for downstream services (because there are none yet).

Given the challenge constraints, I prioritized **clarity and correctness** over micro‑optimizations.

### 4.3 UX tradeoffs

- **What I aimed for**
  - Clear, responsive layouts for discovery/coaching/guides.
  - Intuitive search and filter behavior with URL sync.
  - Friendly, human error messages instead of crashes.
- **What I deferred**
  - Deep accessibility review (ARIA attributes, focus traps in all modals, screen‑reader testing).
  - Skeleton loading states on every list; some screens use simple text loaders instead.
  - Complex navigation for mobile; the layout is mobile‑friendly but not fully optimized.

With more time, I would run this through an a11y pass and extend skeleton/loading treatments.

### 4.4 Infrastructure tradeoffs

- **Current state**
  - Assumes a single PostgreSQL database reachable via `DATABASE_URL`.
  - No CI/CD configuration is committed.
- **Deferred**
  - Automated migrations in CI.
  - Observability (logging, tracing, metrics).
  - Multi‑env configuration (dev/stage/prod).

For a hiring challenge, I chose to keep the infra story simple and focus on application design.

---

## 5. Testing

### 5.1 Why tests here are small but meaningful

The requirement is **“at least one meaningful test (or explain why not)”**.

I chose to focus on testing `getPagination` in `src/lib/pagination.ts` because:

- It is used by multiple core endpoints (`/api/coaching`, `/api/guides`, `/api/discovery`).
- Incorrect pagination logic leads to subtle but serious UX issues (missing items, duplicated pages, etc.).
- It is pure logic and easy to validate precisely with unit tests.

### 5.2 What is tested

- `getPagination`:
  - Normal case: returns correct `page`, `pageSize`, `skip`, and `take` for typical inputs.
  - Boundary cases: handles page numbers less than 1 gracefully.
  - Large page values: still produce coherent `skip`/`take` values.

Tests are implemented using **Vitest** and can be run with:

```bash
npm test
```

### 5.3 What I would test next

With more time, I would expand coverage to:

- API route behavior (integration-ish tests hitting `/api/...` handlers).
- Form behavior and URL synchronization in the discovery and coaching pages.
- Auth flows (e.g., ensuring protected routes redirect unauthenticated users).

---

## 6. Error Handling

### 6.1 API layer

- Each major API route (`/api/coaching`, `/api/guides`, `/api/discovery`) wraps handler logic in a `try/catch`.
- On error, the handlers:
  - Log the error server‑side for debugging.
  - Return a JSON response with an appropriate HTTP status code (typically `500`) and a short, user‑facing message.

### 6.2 UI layer

- Pages that consume these APIs via TanStack Query check:
  - `isLoading` – show a loading state.
  - `isError` – show a clear error message (not a stack trace).
  - Fallback UI when there is no data (e.g. \"No coaching offers found\").
- This ensures that:
  - The UI **doesn’t crash** when an API errors.
  - Users get understandable feedback and simple recovery actions (e.g. clear filters).

### 6.3 Future improvements

- Add structured error types and codes for better client‑side handling.
- Aggregate errors in an observability tool (e.g. Sentry) instead of console logging.
- Introduce user‑visible error boundaries for unexpected client‑side exceptions.

---

## 7. What I’d Build Next

If I had more time, I would extend Impact GG along three main axes:

### 7.1 Depth of existing flows

- **Coaching**
  - Add availability, scheduling, and time‑zone‑aware booking.
  - Add reviews/ratings for coaches.
  - Support multiple offerings per coach (e.g., group sessions, VOD review only, aim training).

- **Guides**
  - Richer content blocks (images, embedded VODs, code/strategy snippets).
  - Tagging and categorization (e.g. \"Valorant\", \"Macro\", \"Aim\", \"Support\").
  - Reactions and comments for community feedback.

### 7.2 New capabilities

- **Team recruitment**
  - LFT (player) and LFP (team) posts tied back to the same user profiles.
  - Filters by role, rank, availability, and region.

- **Social graph**
  - Follow/favorite coaches and players.
  - Personalized discovery based on who you follow and what you’ve engaged with.

### 7.3 Operational excellence

- Add CI with:
  - Type checks and linting on every PR.
  - Test runs with Vitest.
  - Preview deployments (e.g. Vercel).
- Add observability:
  - Centralized logging and error reporting.
  - Basic metrics on API performance and DB queries.

---

## 8. How to Read This Project as a Reviewer

- **Start with `README.md`** for the high‑level overview and how to run the app.
- **Skim `prisma/schema.prisma`** to understand the domain model.
- **Look at `src/app/api/...`** for how data is exposed and paginated.
- **Browse `src/app/(protected)/*`** to see how pages are composed, how state flows from URL → hooks → UI, and how errors are handled.
- **Check `src/lib/pagination.test.ts`** to see the testing setup and style.

Thanks for taking the time to review this. I’m happy to go deeper into any part of the system or extend it in directions that align with how Rize.GG thinks about esports products.

