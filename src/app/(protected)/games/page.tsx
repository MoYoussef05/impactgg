"use client";

import { useEffect, useMemo, useState } from "react";
import { useGamesQuery } from "@/hooks/useGamesQuery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryStates } from "nuqs";
import { gamesSearchParams } from "./searchParams";

const PAGE_SIZE = 15;

export default function GamesPage() {
  const [{ q, page }, setUrlState] = useQueryStates(gamesSearchParams, {
    history: "push",
  });

  // Draft input so we don't push URL updates on every keystroke.
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const { data, isLoading, isError, error, isFetching } = useGamesQuery({
    q: q || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQ = searchInput.trim();
    // Batched URL updates (q + page) in one tick.
    setUrlState({
      q: nextQ ? nextQ : null,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchInput("");
    // Clear all keys managed by this hook.
    setUrlState(null);
  };

  const canGoPrev = page > 1;
  const canGoNext = data && page < totalPages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
        <span className="text-sm text-muted-foreground">
          {data ? `${data.total} results` : null}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <Label htmlFor="search">Search by title</Label>
          <Input
            id="search"
            placeholder="e.g. Fortnite"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1 sm:pt-6">
          <Button type="submit" disabled={isFetching}>
            Search
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={handleReset}
            disabled={isFetching && !q && !searchInput}
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-2 text-sm font-medium text-muted-foreground">
          Results
        </div>

        {isLoading && !data ? (
          <div className="p-4 text-sm text-muted-foreground">Loading…</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">
            {(error as Error)?.message || "Failed to load games."}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No games found.
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {data.items.map((game) => (
                <li key={game.id} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate text-sm font-semibold">
                        {game.title}
                      </h2>
                      <Badge variant={"secondary"}>{game.genre}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {game.short_description}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{game.platform}</span>
                      <span>•</span>
                      <span>{game.publisher}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-xs">
              <div className="text-muted-foreground">
                Page {data.page} of {totalPages}
                {isFetching && (
                  <span className="ml-2 text-[11px] italic">
                    Updating results…
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() =>
                    canGoPrev &&
                    setUrlState({
                      page: page - 1,
                    })
                  }
                  disabled={!canGoPrev || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() =>
                    canGoNext &&
                    setUrlState({
                      page: page + 1,
                    })
                  }
                  disabled={!canGoNext || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
