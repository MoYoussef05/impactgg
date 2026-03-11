
"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { deleteAchievement } from "@/actions/achievements";
import { Button } from "@/components/ui/button";

const deleteAchievementSchema = z.object({
  achievementId: z.string().min(1),
  userId: z.string().min(1),
});

type DeleteAchievementFormProps = {
  achievementId: string;
  userId: string;
  formId?: string;
  onDeleted?: () => void;
};

export default function DeleteAchievementForm({
  achievementId,
  userId,
  formId = "delete-achievement-form",
  onDeleted,
}: DeleteAchievementFormProps) {
  const form = useForm({
    defaultValues: deleteAchievementSchema.parse({
      achievementId,
      userId,
    }),
    validators: {
      onSubmit: deleteAchievementSchema,
    },
    onSubmit: async ({ value }) => {
      const deleted = await deleteAchievement(value.achievementId, value.userId);
      if (!deleted) {
        toast.error("Failed to delete achievement");
        return;
      }
      toast.success("Achievement deleted successfully");
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
        <h3 className={"text-base font-semibold"}>Delete achievement</h3>
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
