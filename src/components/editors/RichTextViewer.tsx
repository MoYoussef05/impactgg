"use client";

import { cn } from "@/lib/utils";

type RichTextViewerProps = {
  value: string;
  className?: string;
};

export default function RichTextViewer({
  value,
  className,
}: RichTextViewerProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-h2:mt-4 prose-h2:mb-2",
        "[&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-3",
        "[&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-3",
        "[&_li]:my-1 [&_li]:marker:text-muted-foreground",
        "[&_ul_ul]:list-[circle] [&_ol_ol]:list-[lower-alpha]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
