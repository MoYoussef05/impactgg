"use client";

import { useState, useTransition } from "react";

import { getCoachAvailability, setCoachAvailability } from "@/actions/booking";
import MultiGamesCombobox from "@/components/inputs/combobox/MultiGamesCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CoachingAvailability } from "@/generated/prisma/client";
import { toast } from "sonner";

type AvailabilitySectionProps = {
  coachId: string;
  initialAvailability: CoachingAvailability[];
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIME_ZONES = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Madrid",
  "Europe/Rome",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
];

type AvailabilityEntry = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  game?: string;
  timeZone: string;
};

type SingleGameComboboxProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
};

function SingleGameCombobox({ value, onChange }: SingleGameComboboxProps) {
  return (
    <MultiGamesCombobox
      value={value ? [value] : []}
      onChange={(next) => onChange(next[0] ?? undefined)}
      placeholder="Any game"
      aria-label="Game"
    />
  );
}

export default function AvailabilitySection({
  coachId,
  initialAvailability,
}: AvailabilitySectionProps) {
  const [entries, setEntries] = useState<AvailabilityEntry[]>(
    initialAvailability.map((a) => ({
      id: a.id,
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      game: a.game ?? undefined,
      timeZone: a.timeZone,
    })),
  );

  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    setEntries((prev) => [
      ...prev,
      {
        dayOfWeek: 0,
        startTime: "18:00",
        endTime: "19:00",
        timeZone: "UTC",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof AvailabilityEntry,
    value: string,
  ) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              [field]:
                field === "dayOfWeek"
                  ? Number(value)
                  : value === ""
                    ? undefined
                    : value,
            }
          : entry,
      ),
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      const trimmed = entries.map((e) => ({
        ...e,
        game: e.game?.trim() || undefined,
      }));

      const result = await setCoachAvailability(coachId, trimmed as any);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const latest = await getCoachAvailability(coachId);
      setEntries(
        latest.map((a) => ({
          id: a.id,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          game: a.game ?? undefined,
          timeZone: a.timeZone,
        })),
      );
      toast.success("Availability updated.");
    });
  };

  return (
    <section className="px-16">
      <Separator className="my-4" />
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Availability</h2>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleAdd}
          disabled={isPending}
        >
          Add slot
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground max-w-2xl">
        Configure when you&apos;re generally available for coaching sessions.
        Learners can request any time that falls inside these windows.
      </p>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t added any availability yet.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const isCustomTimeZone = !TIME_ZONES.includes(entry.timeZone);

            return (
              <div
                key={entry.id ?? index}
                className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4"
              >
                <div className="space-y-1 flex flex-col">
                  <Label>Day</Label>
                  <Select
                    value={
                      entry.dayOfWeek !== undefined
                        ? entry.dayOfWeek.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      handleChange(index, "dayOfWeek", value ?? "")
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((label, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Start</Label>
                  <Input
                    type="time"
                    value={entry.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>End</Label>
                  <Input
                    type="time"
                    value={entry.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
                  />
                </div>
                <div className="min-w-[160px] flex-1 space-y-1">
                  <Label>Game (optional)</Label>
                  <SingleGameCombobox
                    value={entry.game}
                    onChange={(value) =>
                      handleChange(index, "game", value ?? "")
                    }
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <Label>Time zone</Label>
                  <Select
                    value={isCustomTimeZone ? "custom" : entry.timeZone}
                    onValueChange={(value) => {
                      if (value === "custom") {
                        handleChange(index, "timeZone", entry.timeZone || "");
                        return;
                      }
                      handleChange(index, "timeZone", value ?? "");
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select a time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        Other (enter manually)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {isCustomTimeZone && (
                    <Input
                      className="mt-1"
                      value={entry.timeZone}
                      onChange={(e) =>
                        handleChange(index, "timeZone", e.target.value)
                      }
                      placeholder="e.g. UTC or Europe/Berlin"
                    />
                  )}
                </div>
                <div className="ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    disabled={isPending}
                  >
                    ×
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save availability"}
        </Button>
      </div>
    </section>
  );
}
