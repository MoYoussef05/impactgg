"use client";

import { useEffect, useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookingDateTimePickerValue = {
  startsAt: Date | null;
  endsAt: Date | null;
};

type BookingDateTimePickerProps = {
  coachId: string;
  durationMinutes: number;
  value: BookingDateTimePickerValue;
  onChange: (value: BookingDateTimePickerValue) => void;
};

type AvailabilityBlock = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type TimeSlot = {
  startsAt: Date;
  endsAt: Date;
  label: string;
  disabled: boolean;
};

export function BookingDateTimePicker({
  coachId,
  durationMinutes,
  value,
  onChange,
}: BookingDateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/coach-availability?coachId=${encodeURIComponent(coachId)}`,
        );
        if (!res.ok) {
          throw new Error("Failed to load availability");
        }
        const data = (await res.json()) as {
          availability: AvailabilityBlock[];
        };
        if (isMounted) {
          setAvailability(data.availability ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (coachId) {
      loadAvailability();
    }

    return () => {
      isMounted = false;
    };
  }, [coachId]);

  const slotsForDay: TimeSlot[] = useMemo(() => {
    if (!selectedDate || !availability.length || !durationMinutes) {
      return [];
    }

    const dayOfWeek = selectedDate.getDay();
    const blocksForDay = availability.filter(
      (block) => block.dayOfWeek === dayOfWeek,
    );
    if (!blocksForDay.length) return [];

    const stepMinutes = 30;
    const totalMinutes = 24 * 60;
    const result: TimeSlot[] = [];

    for (
      let startMinutes = 0;
      startMinutes + durationMinutes <= totalMinutes;
      startMinutes += stepMinutes
    ) {
      const endMinutes = startMinutes + durationMinutes;

      const enabled = blocksForDay.some((block) => {
        const [blockStartH, blockStartM] = block.startTime
          .split(":")
          .map(Number);
        const [blockEndH, blockEndM] = block.endTime.split(":").map(Number);
        const blockStart = blockStartH * 60 + blockStartM;
        const blockEnd = blockEndH * 60 + blockEndM;

        return startMinutes >= blockStart && endMinutes <= blockEnd;
      });

      const dateUtcStart = new Date(
        Date.UTC(
          selectedDate.getUTCFullYear(),
          selectedDate.getUTCMonth(),
          selectedDate.getUTCDate(),
          Math.floor(startMinutes / 60),
          startMinutes % 60,
          0,
          0,
        ),
      );
      const dateUtcEnd = new Date(
        dateUtcStart.getTime() + durationMinutes * 60 * 1000,
      );

      const label = dateUtcStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      result.push({
        startsAt: dateUtcStart,
        endsAt: dateUtcEnd,
        label,
        disabled: !enabled,
      });
    }

    return result;
  }, [availability, durationMinutes, selectedDate]);

  const selectedKey =
    value.startsAt?.toISOString() ?? value.endsAt?.toISOString() ?? null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="rounded-lg border bg-card p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date ?? undefined);
              if (!date) {
                onChange({ startsAt: null, endsAt: null });
              }
            }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Time slots</p>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading availability..."
                : !selectedDate
                  ? "Pick a date to see available times."
                  : slotsForDay.length === 0
                    ? "No availability for this day."
                    : "Only slots within availability are clickable."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {slotsForDay.map((slot) => {
              const key = slot.startsAt.toISOString();
              const isSelected = selectedKey === key;

              return (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-8 px-2 text-xs",
                    slot.disabled &&
                      "cursor-not-allowed opacity-40 hover:bg-background hover:text-foreground",
                  )}
                  disabled={slot.disabled}
                  onClick={() =>
                    onChange({
                      startsAt: slot.startsAt,
                      endsAt: slot.endsAt,
                    })
                  }
                >
                  {slot.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
