"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQueryStates } from "nuqs";

import { useDiscoveryUsersQuery } from "@/hooks/useDiscoveryUsersQuery";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { discoverySearchParams } from "./searchParams";

const PAGE_SIZE = 24;

export default function DiscoveryPage() {
  const [{ q, page }, setUrlState] = useQueryStates(discoverySearchParams, {
    history: "push",
  });

  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const { data, isLoading, isError, error, isFetching } =
    useDiscoveryUsersQuery({
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
    setUrlState({
      q: nextQ ? nextQ : null,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchInput("");
    setUrlState(null);
  };

  const canGoPrev = page > 1;
  const canGoNext = data && page < totalPages;

  return (
    <div className="space-y-6 px-4 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Discovery</h1>
        <span className="text-sm text-muted-foreground">
          {data ? `${data.total} users` : null}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Search by name or email</Label>
          <Input
            id="search"
            placeholder="e.g. Jane Doe"
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

      <div>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            People
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && !data ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {(error as Error)?.message || "Failed to load users."}
            </p>
          ) : !data || data.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.items.map((user) => (
                  <li key={user.id}>
                    <Link href={`/u/${user.id}`}>
                      <Card className="h-full transition hover:bg-muted/60">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="size-12 shrink-0 rounded-lg">
                              <AvatarImage src={user.image ?? ""} />
                              <AvatarFallback>
                                {user.name?.charAt(0) ?? "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-base">
                                {user.name ?? "Unknown user"}
                              </CardTitle>
                              <CardDescription className="truncate">
                                {user.email}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                            <Badge variant={"outline"}>
                              {user._count.achievements} achievements
                            </Badge>
                            <Badge variant={"outline"}>
                              {user._count.guides} guides
                            </Badge>
                            <Badge variant={"outline"}>
                              {user._count.coaching} coaching offers
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>

              <Separator />

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
        </CardContent>
      </div>
    </div>
  );
}
