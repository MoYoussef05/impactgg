"use client";

import { useState } from "react";
import CreateGuideForm from "@/components/forms/guide/CreateGuideForm";
import DeleteGuideForm from "@/components/forms/guide/DeleteGuideForm";
import EditGuideForm from "@/components/forms/guide/EditGuideForm";
import RichTextViewer from "@/components/editors/RichTextViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Guide } from "@/generated/prisma/client";
import type { GuideInput } from "@/validators/guide";
import {
  IconBookFilled,
  IconPencilFilled,
  IconPlus,
} from "@tabler/icons-react";

type GuidesSectionProps = {
  userId: string;
  guides: Guide[];
};

const INITIAL_VISIBLE = 3;
const LOAD_MORE_STEP = 6;

function GuideItem({ guide, userId }: { guide: Guide; userId: string }) {
  const editFormId = `edit-guide-form-${guide.id}`;
  const deleteFormId = `delete-guide-form-${guide.id}`;
  const previewDialogId = `preview-guide-${guide.id}`;

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          <div className={"flex items-center gap-2 mb-2"}>
            <Badge size={"lg"} variant={"outline"}>
              <IconBookFilled className={"size-3.5"} />
              {guide.game}
            </Badge>
          </div>
        </CardDescription>
        <CardTitle>{guide.title}</CardTitle>

        <CardAction className={"flex items-center gap-1"}>
          <Dialog>
            <DialogTrigger render={<Button variant={"outline"} size={"sm"} />}>
              Preview
            </DialogTrigger>
            <DialogContent aria-describedby={previewDialogId}>
              <DialogHeader>
                <DialogTitle>{guide.title}</DialogTitle>
                <DialogDescription id={previewDialogId}>
                  {guide.game}
                </DialogDescription>
              </DialogHeader>
              <DialogPanel>
                <RichTextViewer value={guide.content || ""} />
              </DialogPanel>
              <DialogFooter>
                <DialogClose render={<Button variant={"outline"} />}>
                  Close
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className={"shrink-0"}
                />
              }
            >
              <IconPencilFilled />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Guide</DialogTitle>
                <DialogDescription>Edit your guide.</DialogDescription>
              </DialogHeader>
              <DialogPanel>
                <EditGuideForm
                  guideId={guide.id}
                  initialValues={guide as unknown as GuideInput}
                  formId={editFormId}
                />

                <Separator className={"my-4"} />

                <DeleteGuideForm
                  guideId={guide.id}
                  userId={userId}
                  formId={deleteFormId}
                />
              </DialogPanel>
              <DialogFooter>
                <DialogClose render={<Button variant={"outline"} />}>
                  Cancel
                </DialogClose>
                <DialogClose
                  render={<Button type={"submit"} form={editFormId} />}
                >
                  Save
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className={"text-sm text-muted-foreground line-clamp-2"}>
          {guide.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function GuidesSection({ userId, guides }: GuidesSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visibleGuides = guides.slice(0, visibleCount);
  const canShowMore = visibleCount < guides.length;

  return (
    <section className={"px-16"}>
      <Separator className={"my-4"} />

      <div className={"flex items-center justify-between gap-4 mb-4"}>
        <h2 className={"text-xl font-bold"}>Guides</h2>
        <Dialog>
          <DialogTrigger render={<Button variant={"outline"} size={"icon"} />}>
            <IconPlus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guide</DialogTitle>
              <DialogDescription>
                Add a new guide to your profile.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <CreateGuideForm userId={userId} />
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant={"outline"} />}>
                Cancel
              </DialogClose>
              <DialogClose
                render={<Button type={"submit"} form={"create-guide-form"} />}
              >
                Add
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {guides.length === 0 ? (
        <p className={"text-sm text-muted-foreground"}>No guides yet.</p>
      ) : (
        <div className={"space-y-4"}>
          <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
            {visibleGuides.map((guide) => (
              <GuideItem key={guide.id} guide={guide} userId={userId} />
            ))}
          </div>
          {canShowMore && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
              >
                Show more guides
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
