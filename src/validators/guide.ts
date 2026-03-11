import * as z from "zod";

export const guideInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string(),
  game: z.string().min(1),
  userId: z.string().min(1),
});

export type GuideInput = z.infer<typeof guideInputSchema>;
