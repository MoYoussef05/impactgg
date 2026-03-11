import * as z from "zod";

export const coachingInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  game: z.string().min(1),
  pricePerHour: z.number().int().min(0),
  userId: z.string().min(1),
});

export type CoachingInput = z.infer<typeof coachingInputSchema>;
