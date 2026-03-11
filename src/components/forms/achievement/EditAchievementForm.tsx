"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { updateAchievement } from "@/actions/achievements";
import GamesCombobox from "@/components/inputs/combobox/GamesCombobox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AchievementType } from "@/generated/prisma/enums";
import {
  ACHIEVEMENT_TYPE_LABELS,
  type AchievementInput,
  achievementInputSchema,
} from "@/validators/achievement";

type EditAchievementFormProps = {
  achievementId: string;
  initialValues: AchievementInput;
  formId?: string;
  onSaved?: () => void;
};

export default function EditAchievementForm({
  achievementId,
  initialValues,
  formId = "edit-achievement-form",
  onSaved,
}: EditAchievementFormProps) {
  const form = useForm({
    defaultValues: achievementInputSchema.parse(initialValues),
    validators: {
      onSubmit: achievementInputSchema,
    },
    onSubmit: async ({ value }) => {
      const updated = await updateAchievement(achievementId, value);
      if (!updated) {
        toast.error("Failed to update achievement");
        return;
      }
      toast.success("Achievement updated successfully");
      onSaved?.();
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
      <form.Field
        name="type"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  if (value != null) field.handleChange(value);
                }}
                aria-label="Select type"
                aria-invalid={isInvalid}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectPopup>
                  {Object.values(AchievementType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ACHIEVEMENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              <FieldDescription>Select the achievement type</FieldDescription>
            </Field>
          );
        }}
      />

      <form.Field
        name="game"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Game</FieldLabel>
              <GamesCombobox
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
              />
              <FieldDescription>Select the related game</FieldDescription>
            </Field>
          );
        }}
      />

      <form.Field
        name="description"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Achieved</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="Describe the achievement you achieved"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Describe what you achieved</FieldDescription>
            </Field>
          );
        }}
      />

      <form.Field
        name="year"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Year</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="Enter the year"
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  field.handleChange(raw === "" ? undefined : Number(raw));
                }}
              />
              <FieldDescription>Year the achievement happened</FieldDescription>
            </Field>
          );
        }}
      />
    </form>
  );
}
