import * as z from "zod";

export const bookingStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
]);

export type BookingStatus = z.infer<typeof bookingStatusEnum>;

export const bookingRequestSchema = z
  .object({
    coachingId: z.string().min(1),
    coachId: z.string().min(1),
    learnerId: z.string().min(1),
    game: z.string().min(1),
    startsAt: z.date(),
    endsAt: z.date(),
    durationMinutes: z.number().int().positive(),
    learnerNote: z.string().max(2000).optional(),
    preferredDiscord: z.string().max(255).optional(),
    learnerEmail: z.string().email().optional(),
  })
  .refine(
    (data) => data.endsAt.getTime() > data.startsAt.getTime(),
    "End time must be after start time.",
  );

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const availabilityInputSchema = z.object({
  id: z.string().optional(),
  coachId: z.string().min(1),
  game: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "startTime must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "endTime must be in HH:mm format"),
  timeZone: z.string().min(1),
});

export type AvailabilityInput = z.infer<typeof availabilityInputSchema>;

