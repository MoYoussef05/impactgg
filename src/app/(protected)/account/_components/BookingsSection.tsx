"use client";

import { useTransition } from "react";

import {
  cancelLearnerBooking,
  updateBookingStatus,
} from "@/actions/booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CoachingBooking } from "@/generated/prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";

type CoachBookingsSectionProps = {
  coachId: string;
  bookings: (CoachingBooking & {
    coaching: { id: string; title: string; game: string };
    learner: { id: string; name: string | null; email: string | null };
  })[];
};

export function CoachBookingsSection({
  coachId,
  bookings,
}: CoachBookingsSectionProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (bookingId: string, status: string) => {
    startTransition(async () => {
      const result = await updateBookingStatus({
        bookingId,
        coachId,
        status: status as any,
      });
      if (!result.ok) {
        toast.error(result.message);
      } else {
        toast.success("Booking updated.");
      }
    });
  };

  if (bookings.length === 0) {
    return null;
  }

  return (
    <section className="px-16">
      <Separator className="my-4" />
      <h2 className="mb-3 text-xl font-bold">Bookings</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm">
                  {booking.coaching.title}
                </CardTitle>
                <Badge variant="outline" className="uppercase text-[10px]">
                  {booking.status.toLowerCase()}
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">
                {booking.coaching.game} •{" "}
                {format(booking.startsAt, "MMM d, yyyy HH:mm")} (
                {booking.durationMinutes} min)
              </CardDescription>
              <CardDescription className="mt-1 text-xs">
                Learner: {booking.learner.name ?? "Unknown"} (
                {booking.learner.email ?? "no email"})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {booking.learnerNote && (
                <p className="text-xs text-muted-foreground line-clamp-3">
                  “{booking.learnerNote}”
                </p>
              )}
              {booking.preferredDiscord && (
                <p className="text-[11px] text-muted-foreground">
                  Discord: {booking.preferredDiscord}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {booking.status === "PENDING" && (
                  <>
                    <Button
                      size="xs"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(booking.id, "ACCEPTED")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(booking.id, "REJECTED")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
                {booking.status === "ACCEPTED" && (
                  <>
                    <Button
                      size="xs"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(booking.id, "COMPLETED")
                      }
                    >
                      Mark completed
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleStatusChange(booking.id, "CANCELLED")
                      }
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

type LearnerBookingsSectionProps = {
  learnerId: string;
  bookings: (CoachingBooking & {
    coaching: { id: string; title: string; game: string };
    coach: { id: string; name: string | null; email: string | null };
  })[];
};

export function LearnerBookingsSection({
  learnerId,
  bookings,
}: LearnerBookingsSectionProps) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = (bookingId: string) => {
    startTransition(async () => {
      const result = await cancelLearnerBooking({ bookingId, learnerId });
      if (!result.ok) {
        toast.error(result.message);
      } else {
        toast.success("Booking cancelled.");
      }
    });
  };

  if (bookings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You don&apos;t have any coaching bookings yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm">
                {booking.coaching.title}
              </CardTitle>
              <Badge variant="outline" className="uppercase text-[10px]">
                {booking.status.toLowerCase()}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-xs">
              {booking.coaching.game} •{" "}
              {format(booking.startsAt, "MMM d, yyyy HH:mm")} (
              {booking.durationMinutes} min)
            </CardDescription>
            <CardDescription className="mt-1 text-xs">
              Coach: {booking.coach.name ?? "Unknown"} (
              {booking.coach.email ?? "no email"})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {booking.learnerNote && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                “{booking.learnerNote}”
              </p>
            )}
            {booking.preferredDiscord && (
              <p className="text-[11px] text-muted-foreground">
                Discord you provided: {booking.preferredDiscord}
              </p>
            )}
            {["PENDING", "ACCEPTED"].includes(booking.status) && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

