"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { createGuide } from "@/actions/guide";
import RichTextEditor from "@/components/editors/RichTextEditor";
import GamesCombobox from "@/components/inputs/combobox/GamesCombobox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type GuideInput, guideInputSchema } from "@/validators/guide";

type CreateGuideFormProps = {
  userId: string;
  formId?: string;
  onCreated?: () => void;
};

export default function CreateGuideForm({
  userId,
  formId = "create-guide-form",
  onCreated,
}: CreateGuideFormProps) {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      game: "",
      userId,
    } satisfies GuideInput,
    validators: {
      onSubmit: guideInputSchema,
    },
    onSubmit: async ({ value }) => {
      const created = await createGuide(value);
      if (!created) {
        toast.error("Failed to create guide");
        return;
      }
      toast.success("Guide created successfully");
      form.reset();
      onCreated?.();
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
                placeholder="Guide title"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Give your guide a clear title</FieldDescription>
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
              <FieldDescription>Choose the game this guide is for</FieldDescription>
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
                placeholder="What’s this guide about?"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Short summary of the guide</FieldDescription>
            </Field>
          );
        }}
      />

      <form.Field
        name="content"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Content</FieldLabel>
              <RichTextEditor
                value={field.state.value ?? ""}
                onChange={(html) => field.handleChange(html)}
                placeholder="Write your guide like a blog post…"
              />
              <FieldDescription>
                Full guide content (supports basic formatting)
              </FieldDescription>
            </Field>
          );
        }}
      />
    </form>
  );
}

