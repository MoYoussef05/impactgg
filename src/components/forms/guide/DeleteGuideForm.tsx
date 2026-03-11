"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { deleteGuide } from "@/actions/guide";
import { Button } from "@/components/ui/button";

const deleteGuideSchema = z.object({
  guideId: z.string().min(1),
  userId: z.string().min(1),
});

type DeleteGuideFormProps = {
  guideId: string;
  userId: string;
  formId?: string;
  onDeleted?: () => void;
};

export default function DeleteGuideForm({
  guideId,
  userId,
  formId = "delete-guide-form",
  onDeleted,
}: DeleteGuideFormProps) {
  const form = useForm({
    defaultValues: deleteGuideSchema.parse({ guideId, userId }),
    validators: { onSubmit: deleteGuideSchema },
    onSubmit: async ({ value }) => {
      const deleted = await deleteGuide(value.guideId, value.userId);
      if (!deleted) {
        toast.error("Failed to delete guide");
        return;
      }
      toast.success("Guide deleted successfully");
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
        <h3 className={"text-base font-semibold"}>Delete guide</h3>
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

