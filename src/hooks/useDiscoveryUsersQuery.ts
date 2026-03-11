"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface DiscoveryUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  _count: {
    achievements: number;
    guides: number;
    coaching: number;
  };
}

export interface DiscoveryQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface DiscoveryQueryResponse {
  items: DiscoveryUser[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchDiscoveryUsers(
  params: DiscoveryQueryParams,
): Promise<DiscoveryQueryResponse> {
  const searchParams = new URLSearchParams();

  if (params.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/api/discovery?${queryString}` : "/api/discovery";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

export function useDiscoveryUsersQuery(params: DiscoveryQueryParams) {
  return useQuery<DiscoveryQueryResponse>({
    queryKey: ["discovery-users", params],
    queryFn: () => fetchDiscoveryUsers(params),
    placeholderData: keepPreviousData,
  });
}

