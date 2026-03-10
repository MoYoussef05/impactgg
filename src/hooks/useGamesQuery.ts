"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Game } from "@/lib/games";

export interface GamesQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface GamesQueryResponse {
  items: Game[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchGames(params: GamesQueryParams): Promise<GamesQueryResponse> {
  const searchParams = new URLSearchParams();

  if (params.q && params.q.trim()) {
    searchParams.set("q", params.q.trim());
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/api/games?${queryString}` : "/api/games";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  return res.json();
}

export function useGamesQuery(params: GamesQueryParams) {
  return useQuery<GamesQueryResponse>({
    queryKey: ["games", params],
    queryFn: () => fetchGames(params),
    placeholderData: keepPreviousData,
  });
}

