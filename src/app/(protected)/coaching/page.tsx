"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQueryStates } from "nuqs";

import MultiGamesCombobox from "@/components/inputs/combobox/MultiGamesCombobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoachingsQuery } from "@/hooks/useCoachingsQuery";
import { coachingSearchParams } from "./searchParams";

const PAGE_SIZE = 24;

export default function CoachingPage() {
  const [{ q, games, page, sort }, setUrlState] = useQueryStates(
    coachingSearchParams,
    {
      history: "push",
    },
  );

  const [searchInput, setSearchInput] = useState(q);
  const [selectedGames, setSelectedGames] = useState<string[]>(
    games
      ? games
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : [],
  );

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    setSelectedGames(
      games
        ? games
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        : [],
    );
  }, [games]);

  const { data, isLoading, isError, error, isFetching } = useCoachingsQuery({
    q: q || undefined,
    games: selectedGames.length > 0 ? selectedGames : undefined,
    page,
    pageSize: PAGE_SIZE,
    sort: (sort as "recent" | "priceAsc" | "priceDesc") || "recent",
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQ = searchInput.trim();
    setUrlState({
      q: nextQ ? nextQ : null,
      games: selectedGames.length > 0 ? selectedGames.join(",") : null,
      page: 1,
      sort: sort || "recent",
    });
  };

  const handleReset = () => {
    setSearchInput("");
    setSelectedGames([]);
    setUrlState({ q: null, games: null, page: 1, sort: "recent" });
  };

  const canGoPrev = page > 1;
  const canGoNext = data && page < totalPages;

  return (
    <div className="space-y-6 px-4 py-4 sm:px-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Coaching</h1>
        <span className="text-sm text-muted-foreground">
          {data ? `${data.total} offers` : null}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border bg-card p-4"
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label htmlFor="search">Search coaching</Label>
            <Input
              id="search"
              placeholder="Search by title or description"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="games">Filter by games</Label>
            <MultiGamesCombobox
              id="games"
              value={selectedGames}
              onChange={(next) => setSelectedGames(next)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort">Sort by</Label>
            <Select
              value={sort || "recent"}
              onValueChange={(value) =>
                setUrlState({
                  sort: value,
                  page: 1,
                })
              }
            >
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isFetching}>
            Search
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={handleReset}
            disabled={
              isFetching && !q && !searchInput && selectedGames.length === 0
            }
          >
            Reset
          </Button>
        </div>
      </form>

      {isLoading && !data ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading coaching…
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {(error as Error)?.message || "Failed to load coaching."}
          </CardContent>
        </Card>
      ) : !data || data.items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No coaching offers found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filters to find different offers.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant={"outline"} type="button" onClick={handleReset}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((offer) => (
              <Link key={offer.id} href={`/u/${offer.user.id}`}>
                <Card className="h-full transition hover:bg-muted/60">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={"outline"} size={"sm"}>
                        {offer.game}
                      </Badge>
                      <span>•</span>
                      <span>${offer.pricePerHour}/hr</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-base">
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2 text-xs">
                      <Avatar className="size-6 rounded-md">
                        <AvatarImage src={offer.user.image ?? ""} />
                        <AvatarFallback>
                          {offer.user.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {offer.user.name ?? "Unknown coach"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {offer.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
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
  );
}
