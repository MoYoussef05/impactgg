import * as z from "zod";

import { AchievementType } from "@/generated/prisma/enums";

export const ACHIEVEMENT_TYPE_LABELS: Record<AchievementType, string> = {
  [AchievementType.GENERAL]: "General",
  [AchievementType.SEASON]: "Season",
};

export const achievementInputSchema = z.object({
  type: z.enum([AchievementType.GENERAL, AchievementType.SEASON]),
  game: z.string().optional(),
  description: z.string().optional(),
  year: z.number().optional(),
  userId: z.string(),
});

export type AchievementInput = z.infer<typeof achievementInputSchema>;
