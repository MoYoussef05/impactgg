import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getPagination } from "@/lib/pagination";

const PAGE_SIZE = 24;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const gamesParam = (searchParams.get("games") || "").trim();
    const sort = (searchParams.get("sort") || "recent").trim();
    const games = Array.from(
      new Set(
        gamesParam
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
      ),
    );
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { page, pageSize, skip, take } = getPagination(pageParam, PAGE_SIZE);

    const where: any = {};

    if (q.length > 0) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (games.length > 0) {
      where.game = { in: games };
    }

    let orderBy:
      | { createdAt: "desc" }
      | { pricePerHour: "asc" }
      | { pricePerHour: "desc" } = { createdAt: "desc" };

    if (sort === "priceAsc") {
      orderBy = { pricePerHour: "asc" };
    } else if (sort === "priceDesc") {
      orderBy = { pricePerHour: "desc" };
    }

    const [items, total] = await Promise.all([
      prisma.coaching.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.coaching.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to load coaching" },
      { status: 500 },
    );
  }
}

