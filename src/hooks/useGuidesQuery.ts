"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface GuideListItem {
  id: string;
  title: string;
  description: string;
  content: string;
  game: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface GuidesQueryParams {
  q?: string;
  games?: string[];
  page?: number;
  pageSize?: number;
  userId?: string;
}

export interface GuidesQueryResponse {
  items: GuideListItem[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchGuides(
  params: GuidesQueryParams,
): Promise<GuidesQueryResponse> {
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
   if (params.userId) {
    searchParams.set("userId", params.userId);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/api/guides?${queryString}` : "/api/guides";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch guides");
  }

  return res.json();
}

export function useGuidesQuery(params: GuidesQueryParams) {
  return useQuery<GuidesQueryResponse>({
    queryKey: ["guides", params],
    queryFn: () => fetchGuides(params),
    placeholderData: keepPreviousData,
  });
}

