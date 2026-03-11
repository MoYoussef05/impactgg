import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        404 - Page not found
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        Looks like this route whiffed.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Head back to safer ground and keep exploring Impact GG.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/">Back to home</Link>} />
        <Button
          variant="outline"
          render={<Link href="/discovery">Browse players & coaches</Link>}
        />
      </div>
    </main>
  );
}
