"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { type GuideInput, guideInputSchema } from "@/validators/guide";

function normalizeGuideInput(input: GuideInput): GuideInput {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    content: input.content ?? "",
    game: input.game.trim(),
  };
}

export async function createGuide(input: GuideInput) {
  const validated = guideInputSchema.parse(normalizeGuideInput(input));
  try {
    const guide = await prisma.guide.create({ data: validated });
    revalidatePath("/account");
    return guide;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateGuide(id: string, input: GuideInput) {
  const existing = await prisma.guide.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== input.userId) {
    throw new Error("Unauthorized: You do not have permission to edit this guide.");
  }

  const validated = guideInputSchema.parse(normalizeGuideInput(input));

  try {
    const updated = await prisma.guide.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/account");
    return updated;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteGuide(id: string, userId: string) {
  try {
    const existing = await prisma.guide.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error(
        "Unauthorized: You do not have permission to delete this guide.",
      );
    }

    await prisma.guide.delete({ where: { id } });
    revalidatePath("/account");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getGuides(userId: string) {
  try {
    return await prisma.guide.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGuideById(id: string) {
  return prisma.guide.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getMoreFromAuthor(
  userId: string,
  excludeId: string,
  take = 3,
) {
  return prisma.guide.findMany({
    where: {
      userId,
      id: { not: excludeId },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getSuggestedGuides(
  game: string,
  excludeId: string,
  take = 3,
) {
  const sameGame = await prisma.guide.findMany({
    where: {
      game,
      id: { not: excludeId },
    },
    orderBy: { createdAt: "desc" },
    take,
  });

  if (sameGame.length >= take) return sameGame;

  const remaining = take - sameGame.length;
  const others = await prisma.guide.findMany({
    where: {
      id: { notIn: [excludeId, ...sameGame.map((g) => g.id)] },
    },
    orderBy: { createdAt: "desc" },
    take: remaining,
  });

  return [...sameGame, ...others];
}
