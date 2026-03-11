"use server";

import prisma from "@/lib/prisma";

import {
  type AchievementInput,
  achievementInputSchema,
} from "@/validators/achievement";
import { revalidatePath } from "next/cache";

function normalizeAchievementInput(input: AchievementInput): AchievementInput {
  return {
    ...input,
    game: input.game?.trim() ? input.game.trim() : undefined,
    description: input.description?.trim()
      ? input.description.trim()
      : undefined,
  };
}

export async function createAchievement(input: AchievementInput) {
  const validatedData = achievementInputSchema.parse(
    normalizeAchievementInput(input),
  );
  try {
    const achievement = await prisma.achievement.create({
      data: validatedData,
    });
    revalidatePath("/account");
    return achievement;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateAchievement(id: string, input: AchievementInput) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: id },
    select: { userId: true },
  });

  if (!achievement || achievement.userId !== input.userId) {
    throw new Error(
      "Unauthorized: You do not have permission to edit this achievement.",
    );
  }

  const validatedData = achievementInputSchema.parse(input);
  const normalizedData = normalizeAchievementInput(validatedData);

  try {
    const updatedAchievement = await prisma.achievement.update({
      where: { id: id },
      data: normalizedData,
    });
    revalidatePath("/account");
    return updatedAchievement;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteAchievement(id: string, userId: string) {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!achievement || achievement.userId !== userId) {
      throw new Error(
        "Unauthorized: You do not have permission to delete this achievement.",
      );
    }

    await prisma.achievement.delete({ where: { id } });
    revalidatePath("/account");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAchievements(userId: string) {
  try {
    return await prisma.achievement.findMany({
      where: { userId },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
