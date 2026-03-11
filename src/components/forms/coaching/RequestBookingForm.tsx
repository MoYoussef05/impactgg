"use client";

import { useState, useTransition } from "react";

import { createBookingRequest } from "@/actions/booking";
import { BookingDateTimePicker } from "@/components/inputs/BookingDateTimePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingRequestInput } from "@/validators/booking";
import { format } from "date-fns";
import { toast } from "sonner";

type RequestBookingFormProps = {
  coachingId: string;
  coachId: string;
  game: string;
  learnerId: string;
  learnerEmail?: string | null;
};

export function RequestBookingForm({
  coachingId,
  coachId,
  game,
  learnerId,
  learnerEmail,
}: RequestBookingFormProps) {
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [note, setNote] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [email, setEmail] = useState<string>(learnerEmail ?? "");
  const [selection, setSelection] = useState<{
    startsAt: Date | null;
    endsAt: Date | null;
  }>({ startsAt: null, endsAt: null });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selection.startsAt || !selection.endsAt || !durationMinutes) {
      toast.error("Please pick a date, time slot, and duration.");
      return;
    }

    const payload: BookingRequestInput = {
      coachingId,
      coachId,
      learnerId,
      game,
      startsAt: selection.startsAt,
      endsAt: selection.endsAt,
      durationMinutes,
      learnerNote: note || undefined,
      preferredDiscord: discord || undefined,
      learnerEmail: email || undefined,
    };

    startTransition(async () => {
      const result = await createBookingRequest(payload);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(
        `Request sent for ${format(
          selection.startsAt ?? new Date(),
          "MMM d, yyyy HH:mm",
        )} (${durationMinutes} min).`,
      );
      setNote("");
      setDiscord("");
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Date &amp; time</Label>
        <BookingDateTimePicker
          coachId={coachId}
          durationMinutes={durationMinutes}
          value={selection}
          onChange={(next) => setSelection(next)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-duration">Duration (minutes)</Label>
        <Input
          id="booking-duration"
          type="number"
          min={30}
          step={30}
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-note">What do you want to work on?</Label>
        <Textarea
          id="booking-note"
          placeholder="Rank, role, goals, what you'd like to focus on..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-discord">Discord handle (optional)</Label>
          <Input
            id="booking-discord"
            placeholder="e.g. moyoussef"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-email">Contact email</Label>
          <Input
            id="booking-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending request..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}
