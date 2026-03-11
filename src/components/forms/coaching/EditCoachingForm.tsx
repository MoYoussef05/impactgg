"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { updateCoaching } from "@/actions/coaching";
import GamesCombobox from "@/components/inputs/combobox/GamesCombobox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type CoachingInput, coachingInputSchema } from "@/validators/coaching";

type EditCoachingFormProps = {
  coachingId: string;
  initialValues: CoachingInput;
  formId?: string;
  onSaved?: () => void;
};

export default function EditCoachingForm({
  coachingId,
  initialValues,
  formId = "edit-coaching-form",
  onSaved,
}: EditCoachingFormProps) {
  const form = useForm({
    defaultValues: coachingInputSchema.parse(initialValues),
    validators: {
      onSubmit: coachingInputSchema,
    },
    onSubmit: async ({ value }) => {
      const updated = await updateCoaching(coachingId, value);
      if (!updated) {
        toast.error("Failed to update coaching");
        return;
      }
      toast.success("Coaching updated successfully");
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
        name="title"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="Coaching title"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Title of the coaching offer</FieldDescription>
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
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
              />
              <FieldDescription>Game you coach</FieldDescription>
            </Field>
          );
        }}
      />

      <form.Field
        name="pricePerHour"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Price per hour</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(field.state.value ?? 0)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="0"
                onChange={(e) => {
                  const raw = e.target.value;
                  field.handleChange(raw === "" ? 0 : Number(raw));
                }}
              />
              <FieldDescription>Hourly rate</FieldDescription>
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
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="What do students get from your coaching?"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Describe your coaching offer</FieldDescription>
            </Field>
          );
        }}
      />
    </form>
  );
}

