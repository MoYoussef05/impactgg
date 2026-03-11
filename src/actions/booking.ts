"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import {
  type AvailabilityInput,
  type BookingRequestInput,
  type BookingStatus,
  availabilityInputSchema,
  bookingRequestSchema,
} from "@/validators/booking";

function normalizeBookingInput(input: BookingRequestInput): BookingRequestInput {
  return {
    ...input,
    learnerNote: input.learnerNote?.trim() || undefined,
    preferredDiscord: input.preferredDiscord?.trim() || undefined,
    learnerEmail: input.learnerEmail?.trim() || undefined,
  };
}

export async function createBookingRequest(rawInput: BookingRequestInput) {
  try {
    const input = normalizeBookingInput(rawInput);
    const validated = bookingRequestSchema.parse(input);

    if (validated.coachId === validated.learnerId) {
      throw new Error("You cannot book a session with yourself.");
    }

    const availabilityBlocks = await prisma.coachingAvailability.findMany({
      where: {
        coachId: validated.coachId,
      },
    });

    if (!availabilityBlocks.length) {
      throw new Error("This coach has no availability configured.");
    }

    const startsAt = validated.startsAt;
    const endsAt = validated.endsAt;

    const inAvailability = availabilityBlocks.some((block) => {
      const dayOfWeek = startsAt.getUTCDay();
      if (block.dayOfWeek !== dayOfWeek) return false;
      const [startH, startM] = block.startTime.split(":").map(Number);
      const [endH, endM] = block.endTime.split(":").map(Number);
      const startMinutes = startsAt.getUTCHours() * 60 + startsAt.getUTCMinutes();
      const endMinutes = endsAt.getUTCHours() * 60 + endsAt.getUTCMinutes();
      const blockStart = startH * 60 + startM;
      const blockEnd = endH * 60 + endM;
      return startMinutes >= blockStart && endMinutes <= blockEnd;
    });

    if (!inAvailability) {
      throw new Error(
        "Requested time is outside the coach's configured availability.",
      );
    }

    await prisma.coachingBooking.create({
      data: {
        coachId: validated.coachId,
        learnerId: validated.learnerId,
        coachingId: validated.coachingId,
        game: validated.game,
        startsAt,
        endsAt,
        durationMinutes: validated.durationMinutes,
        status: "PENDING",
        learnerNote: validated.learnerNote,
        preferredDiscord: validated.preferredDiscord,
        learnerEmail: validated.learnerEmail,
      },
    });

    revalidatePath("/coaching");
    revalidatePath("/account");
    revalidatePath("/my-bookings");

    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Failed to create booking request.",
    };
  }
}

export async function updateBookingStatus(params: {
  bookingId: string;
  coachId: string;
  status: BookingStatus;
}) {
  const { bookingId, coachId, status } = params;
  try {
    const booking = await prisma.coachingBooking.findUnique({
      where: { id: bookingId },
      select: { coachId: true, status: true },
    });

    if (!booking || booking.coachId !== coachId) {
      throw new Error("You do not have permission to update this booking.");
    }

    const current = booking.status as BookingStatus;

    if (current === "PENDING" && !["ACCEPTED", "REJECTED"].includes(status)) {
      throw new Error("Pending bookings can only be accepted or rejected.");
    }

    if (
      current === "ACCEPTED" &&
      !["CANCELLED", "COMPLETED"].includes(status)
    ) {
      throw new Error("Accepted bookings can only be cancelled or completed.");
    }

    if (!["PENDING", "ACCEPTED"].includes(current)) {
      throw new Error("Only pending or accepted bookings can be updated.");
    }

    await prisma.coachingBooking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/account");
    revalidatePath("/my-bookings");

    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Failed to update booking.",
    };
  }
}

export async function cancelLearnerBooking(params: {
  bookingId: string;
  learnerId: string;
}) {
  const { bookingId, learnerId } = params;
  try {
    const booking = await prisma.coachingBooking.findUnique({
      where: { id: bookingId },
      select: { learnerId: true, status: true },
    });

    if (!booking || booking.learnerId !== learnerId) {
      throw new Error("You do not have permission to cancel this booking.");
    }

    if (!["PENDING", "ACCEPTED"].includes(booking.status)) {
      throw new Error("Only pending or accepted bookings can be cancelled.");
    }

    await prisma.coachingBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/my-bookings");
    revalidatePath("/account");

    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Failed to cancel booking.",
    };
  }
}

export async function getCoachBookings(coachId: string) {
  try {
    return await prisma.coachingBooking.findMany({
      where: { coachId },
      orderBy: { startsAt: "asc" },
      include: {
        coaching: {
          select: {
            id: true,
            title: true,
            game: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getLearnerBookings(learnerId: string) {
  try {
    return await prisma.coachingBooking.findMany({
      where: { learnerId },
      orderBy: { startsAt: "asc" },
      include: {
        coaching: {
          select: {
            id: true,
            title: true,
            game: true,
          },
        },
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCoachAvailability(coachId: string) {
  try {
    return await prisma.coachingAvailability.findMany({
      where: { coachId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function setCoachAvailability(
  coachId: string,
  inputs: AvailabilityInput[],
) {
  try {
    const validated = inputs.map((input) =>
      availabilityInputSchema.parse({ ...input, coachId }),
    );

    await prisma.$transaction([
      prisma.coachingAvailability.deleteMany({
        where: { coachId },
      }),
      prisma.coachingAvailability.createMany({
        data: validated.map((input) => ({
          coachId,
          game: input.game,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
          timeZone: input.timeZone,
        })),
      }),
    ]);

    revalidatePath("/account");

    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Failed to update availability.",
    };
  }
}

