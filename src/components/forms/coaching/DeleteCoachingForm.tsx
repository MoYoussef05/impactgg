"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { deleteCoaching } from "@/actions/coaching";
import { Button } from "@/components/ui/button";

const deleteCoachingSchema = z.object({
  coachingId: z.string().min(1),
  userId: z.string().min(1),
});

type DeleteCoachingFormProps = {
  coachingId: string;
  userId: string;
  formId?: string;
  onDeleted?: () => void;
};

export default function DeleteCoachingForm({
  coachingId,
  userId,
  formId = "delete-coaching-form",
  onDeleted,
}: DeleteCoachingFormProps) {
  const form = useForm({
    defaultValues: deleteCoachingSchema.parse({ coachingId, userId }),
    validators: { onSubmit: deleteCoachingSchema },
    onSubmit: async ({ value }) => {
      const deleted = await deleteCoaching(value.coachingId, value.userId);
      if (!deleted) {
        toast.error("Failed to delete coaching");
        return;
      }
      toast.success("Coaching deleted successfully");
      onDeleted?.();
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={"space-y-4"}
    >
      <div className={"space-y-1"}>
        <h3 className={"text-base font-semibold"}>Delete coaching</h3>
        <p className={"text-sm text-muted-foreground"}>
          This action can’t be undone.
        </p>
      </div>

      <Button type="submit" variant={"destructive"} className={"w-full"}>
        Delete
      </Button>
    </form>
  );
}

