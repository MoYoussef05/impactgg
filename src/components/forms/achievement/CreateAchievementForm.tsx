"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { AchievementType } from "@/generated/prisma/enums";
import GamesCombobox from "@/components/inputs/combobox/GamesCombobox";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAchievement } from "@/actions/achievements";
import {
  ACHIEVEMENT_TYPE_LABELS,
  achievementInputSchema,
} from "@/validators/achievement";

interface CreateAchievementFormProps {
  userId: string;
}

export default function CreateAchievementForm({
  userId,
}: CreateAchievementFormProps) {
  const form = useForm({
    defaultValues: achievementInputSchema.parse({
      type: AchievementType.GENERAL,
      game: undefined,
      description: undefined,
      year: undefined,
      userId: userId,
    }),
    validators: {
      onSubmit: achievementInputSchema,
    },
    onSubmit: async ({ value }) => {
      const achievement = await createAchievement(value);
      if (!achievement) {
        toast.error("Failed to create achievement");
        return;
      }
      toast.success("Achievement created successfully");
      form.reset();
    },
  });

  return (
    <>
      <form
        id="create-achievement-form"
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
                <FieldDescription>
                  Select the type of achievement you want to create
                </FieldDescription>
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
                <FieldDescription>
                  Select the game you want to create an achievement for
                </FieldDescription>
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
                <FieldDescription>
                  Describe the achievement you achieved
                </FieldDescription>
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
                  placeholder="Enter the year you achieved the achievement"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    field.handleChange(raw === "" ? undefined : Number(raw));
                  }}
                />
                <FieldDescription>
                  Enter the year you achieved the achievement
                </FieldDescription>
              </Field>
            );
          }}
        />
      </form>
    </>
  );
}
