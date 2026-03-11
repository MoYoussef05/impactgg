import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getPagination } from "@/lib/pagination";

const PAGE_SIZE = 24;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { page, pageSize, skip, take } = getPagination(pageParam, PAGE_SIZE);

    const where =
      q.length === 0
        ? {}
        : {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          _count: {
            select: {
              achievements: true,
              guides: true,
              coaching: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
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
      { message: "Failed to load users" },
      { status: 500 },
    );
  }
}

