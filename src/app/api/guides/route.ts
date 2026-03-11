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
    const userId = (searchParams.get("userId") || "").trim();
    const games = Array.from(
      new Set(
        gamesParam
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
      ),
    );
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const pageSizeParam = parseInt(searchParams.get("pageSize") || "", 10);
    const basePageSize =
      Number.isFinite(pageSizeParam) && pageSizeParam > 0
        ? pageSizeParam
        : PAGE_SIZE;
    const { page, pageSize, skip, take } = getPagination(pageParam, basePageSize);

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

    if (userId) {
      where.userId = userId;
    }

    const [items, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
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
      prisma.guide.count({ where }),
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
      { message: "Failed to load guides" },
      { status: 500 },
    );
  }
}

