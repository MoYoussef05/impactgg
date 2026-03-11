"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  IconBold,
  IconClearFormatting,
  IconItalic,
  IconListNumbers,
  IconList,
  IconQuote,
  IconUnderline,
  IconHeading,
} from "@tabler/icons-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function format(command: string, value?: string) {
  // `execCommand` is deprecated but still widely supported and is a good
  // zero-dependency fit for a simple “blog-like” editor.
  document.execCommand(command, false, value);
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your guide…",
  className,
}: RichTextEditorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Keep DOM in sync when `value` changes (e.g. form reset).
  React.useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <TooltipProvider>
        <div className={"flex flex-wrap items-center gap-2"}>
          <ButtonGroup>
            <ToolButton label="Bold" onClick={() => format("bold")}>
              <IconBold />
            </ToolButton>
            <ToolButton label="Italic" onClick={() => format("italic")}>
              <IconItalic />
            </ToolButton>
            <ToolButton label="Underline" onClick={() => format("underline")}>
              <IconUnderline />
            </ToolButton>
          </ButtonGroup>

          <ButtonGroup>
            <ToolButton
              label="Bullet list"
              onClick={() => format("insertUnorderedList")}
            >
              <IconList />
            </ToolButton>
            <ToolButton
              label="Numbered list"
              onClick={() => format("insertOrderedList")}
            >
              <IconListNumbers />
            </ToolButton>
          </ButtonGroup>

          <ButtonGroup>
            <ToolButton
              label="Heading"
              onClick={() => format("formatBlock", "h2")}
            >
              <IconHeading />
            </ToolButton>
            <ToolButton
              label="Blockquote"
              onClick={() => format("formatBlock", "blockquote")}
            >
              <IconQuote />
            </ToolButton>
          </ButtonGroup>

          <ButtonGroup>
            <ToolButton
              label="Clear formatting"
              onClick={() => format("removeFormat")}
            >
              <IconClearFormatting />
            </ToolButton>
          </ButtonGroup>
        </div>
      </TooltipProvider>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={cn(
          "min-h-40 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
          "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6",
          "[&_blockquote]:border-l-2 [&_blockquote]:ps-4 [&_blockquote]:text-muted-foreground",
        )}
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
      />
    </div>
  );
}
