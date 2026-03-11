"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface CoachingListItem {
  id: string;
  title: string;
  description: string;
  game: string;
  pricePerHour: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface CoachingsQueryParams {
  q?: string;
  games?: string[];
  page?: number;
  pageSize?: number;
  sort?: "recent" | "priceAsc" | "priceDesc";
}

export interface CoachingsQueryResponse {
  items: CoachingListItem[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchCoachings(
  params: CoachingsQueryParams,
): Promise<CoachingsQueryResponse> {
  const searchParams = new URLSearchParams();

  if (params.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }
  if (params.games && params.games.length > 0) {
    searchParams.set("games", params.games.join(","));
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }
  if (params.sort && params.sort !== "recent") {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/api/coaching?${queryString}` : "/api/coaching";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch coaching");
  }

  return res.json();
}

export function useCoachingsQuery(params: CoachingsQueryParams) {
  return useQuery<CoachingsQueryResponse>({
    queryKey: ["coaching", params],
    queryFn: () => fetchCoachings(params),
    placeholderData: keepPreviousData,
  });
}

