"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import {
  type CoachingInput,
  coachingInputSchema,
} from "@/validators/coaching";

function normalizeCoachingInput(input: CoachingInput): CoachingInput {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    game: input.game.trim(),
  };
}

export async function createCoaching(input: CoachingInput) {
  const validated = coachingInputSchema.parse(normalizeCoachingInput(input));
  try {
    const coaching = await prisma.coaching.create({ data: validated });
    revalidatePath("/account");
    return coaching;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCoaching(id: string, input: CoachingInput) {
  const existing = await prisma.coaching.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== input.userId) {
    throw new Error(
      "Unauthorized: You do not have permission to edit this coaching.",
    );
  }

  const validated = coachingInputSchema.parse(normalizeCoachingInput(input));

  try {
    const updated = await prisma.coaching.update({
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

export async function deleteCoaching(id: string, userId: string) {
  try {
    const existing = await prisma.coaching.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error(
        "Unauthorized: You do not have permission to delete this coaching.",
      );
    }

    await prisma.coaching.delete({ where: { id } });
    revalidatePath("/account");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCoachings(userId: string) {
  try {
    return await prisma.coaching.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
