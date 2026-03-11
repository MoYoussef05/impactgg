import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const coachId = url.searchParams.get("coachId");

  if (!coachId) {
    return NextResponse.json(
      { error: "coachId query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const availability = await prisma.coachingAvailability.findMany({
      where: { coachId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 },
    );
  }
}

