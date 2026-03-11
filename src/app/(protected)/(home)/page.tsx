export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Rize.GG hiring challenge
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Impact GG – built by Moe Youssef
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This prototype tackles a real esports problem: giving players, coaches, and
          creators a focused place to showcase achievements, coaching offers, and
          written guides – instead of scattering everything across Discord, DMs, and
          random docs.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-medium">What this app demonstrates</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The goal isn&apos;t to ship a huge product, but to show how I think,
            scope, and execute:
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>
              • <span className="font-medium">Discovery</span> – searchable, paginated
              list of users with counts for achievements, guides, and coaching offers.
            </li>
            <li>
              • <span className="font-medium">Coaching</span> – filterable, sortable
              coaching offers by game, price, and query.
            </li>
            <li>
              • <span className="font-medium">Guides</span> – profile‑attached written
              content using a rich text editor.
            </li>
            <li>
              • <span className="font-medium">Profiles</span> – a people‑first model
              where content, offers, and achievements all hang off users.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-medium">Tech stack & main libraries</h2>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>
              • <span className="font-medium">Frontend</span>: Next.js 16 (App Router),
              React 19, TypeScript, Tailwind CSS 4, shadcn/ui.
            </li>
            <li>
              • <span className="font-medium">Data & auth</span>: Prisma + PostgreSQL,
              Better Auth, PrismaPg adapter.
            </li>
            <li>
              • <span className="font-medium">Client data layer</span>: TanStack Query,
              Nuqs for URL‑synced filters and pagination.
            </li>
            <li>
              • <span className="font-medium">Content</span>: Lexical rich text editor
              for guides.
            </li>
            <li>
              • <span className="font-medium">DX & testing</span>: TypeScript, ESLint,
              Vitest (with a focused test around the shared pagination helper).
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-medium">How to explore the repo</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          If you&apos;re reviewing this for Rize.GG, these are the best entry points:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li>
            • <span className="font-medium">README.md</span> – high‑level overview,
            setup, and feature tour.
          </li>
          <li>
            • <span className="font-medium">BUILDLOG.md</span> – problem framing,
            options considered, tradeoffs, and what I&apos;d build next.
          </li>
          <li>
            • <span className="font-medium">prisma/schema.prisma</span> – domain model
            for users, achievements, coaching offers, and guides.
          </li>
          <li>
            • <span className="font-medium">API routes</span> – `/api/discovery`,
            `/api/coaching`, `/api/guides` for pagination, filtering, and error
            handling.
          </li>
          <li>
            • <span className="font-medium">Tests</span> – `src/lib/pagination.test.ts`
            to see how pagination is validated.
          </li>
        </ul>
      </section>
    </div>
  );
}
