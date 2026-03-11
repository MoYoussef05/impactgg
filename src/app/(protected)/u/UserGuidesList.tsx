"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useGuidesQuery } from "@/hooks/useGuidesQuery";

interface UserGuidesListProps {
  userId: string;
}

const INITIAL_PAGE_SIZE = 3;
const LOAD_MORE_STEP = 6;

export default function UserGuidesList({ userId }: UserGuidesListProps) {
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);

  const { data, isLoading, isError, error, isFetching } = useGuidesQuery({
    userId,
    page: 1,
    pageSize,
  });

  const canLoadMore = useMemo(() => {
    if (!data) return false;
    return data.items.length < data.total;
  }, [data]);

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Loading guides…
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-destructive">
          {(error as Error)?.message || "Failed to load guides."}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No guides yet</EmptyTitle>
          <EmptyDescription>
            When this user publishes guides, they will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((guide) => (
          <Link key={guide.id} href={`/guides/${guide.id}`}>
            <Card className="h-full transition hover:bg-muted/60">
              <CardHeader>
                <CardTitle className="text-sm">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>{guide.game}</p>
                <p className="line-clamp-2">{guide.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {canLoadMore && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isFetching}
            onClick={() => setPageSize((prev) => prev + LOAD_MORE_STEP)}
          >
            {isFetching ? "Loading…" : "Show more guides"}
          </Button>
        </div>
      )}
    </div>
  );
}
