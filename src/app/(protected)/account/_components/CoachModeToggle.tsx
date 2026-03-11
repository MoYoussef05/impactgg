"use client";

import { useEffect, useState, useTransition } from "react";

import { setCoachMode } from "@/actions/user";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type CoachModeToggleProps = {
  initialIsCoach: boolean;
};

export function CoachModeToggle({ initialIsCoach }: CoachModeToggleProps) {
  const [isCoach, setIsCoach] = useState(initialIsCoach);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = window.localStorage.getItem("impactgg_isCoach");
    if (stored === "1") {
      setIsCoach(true);
    } else if (stored === "0") {
      setIsCoach(false);
    }
  }, []);

  const handleChange = (next: boolean) => {
    setIsCoach(next);
    window.localStorage.setItem("impactgg_isCoach", next ? "1" : "0");

    startTransition(async () => {
      const result = await setCoachMode(next);
      if (!result.ok) {
        toast.error(result.message);
        const fallback = !next;
        setIsCoach(fallback);
        window.localStorage.setItem("impactgg_isCoach", fallback ? "1" : "0");
        return;
      }
      setIsCoach(result.isCoach);
      window.localStorage.setItem(
        "impactgg_isCoach",
        result.isCoach ? "1" : "0",
      );
      toast.success(
        result.isCoach
          ? "Coach mode enabled. Coaching tools are now visible."
          : "Coach mode disabled. Coaching tools are hidden.",
      );
    });
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
      <div className="space-y-1">
        <Label htmlFor="coach-mode-toggle">I offer coaching</Label>
        <p className="text-xs text-muted-foreground max-w-md">
          Turn this on if you want to publish coaching offers, manage
          availability, and respond to learner bookings.
        </p>
      </div>
      <Switch
        id="coach-mode-toggle"
        checked={isCoach}
        onCheckedChange={handleChange}
        disabled={isPending}
      />
    </div>
  );
}

