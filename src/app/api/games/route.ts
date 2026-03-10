import { NextRequest, NextResponse } from "next/server";
import type { Game } from "@/lib/games";

const EXTERNAL_API_URL = "https://www.freetogame.com/api/games";
const CACHE_TTL_MS = 60 * 60 * 1000;

let gamesCache: {
  data: Game[];
  fetchedAt: number;
} | null = null;

async function fetchAllGames(): Promise<Game[]> {
  const now = Date.now();

  if (gamesCache && now - gamesCache.fetchedAt < CACHE_TTL_MS) {
    return gamesCache.data;
  }

  const res = await fetch(EXTERNAL_API_URL, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games from external API");
  }

  const data: Game[] = await res.json();
  gamesCache = { data, fetchedAt: now };
  return data;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(
      parseInt(searchParams.get("page") || "1", 10) || 1,
      1,
    );
    const pageSizeParam =
      parseInt(searchParams.get("pageSize") || "50", 10) || 50;
    const pageSize = Math.min(Math.max(pageSizeParam, 1), 100);

    const allGames = await fetchAllGames();

    let filtered = allGames;
    if (q) {
      filtered = allGames.filter((game) =>
        game.title.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load games" },
      { status: 500 },
    );
  }
}
