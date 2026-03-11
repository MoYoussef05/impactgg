import CreateCoachingForm from "@/components/forms/coaching/CreateCoachingForm";
import DeleteCoachingForm from "@/components/forms/coaching/DeleteCoachingForm";
import EditCoachingForm from "@/components/forms/coaching/EditCoachingForm";
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
import type { Coaching } from "@/generated/prisma/client";
import type { CoachingInput } from "@/validators/coaching";
import {
  IconPencilFilled,
  IconPlus,
  IconUserFilled,
} from "@tabler/icons-react";
import Link from "next/link";

type CoachingsSectionProps = {
  userId: string;
  coachings: Coaching[];
  filterGame?: string;
};

function CoachingItem({
  coaching,
  userId,
}: {
  coaching: Coaching;
  userId: string;
}) {
  const editFormId = `edit-coaching-form-${coaching.id}`;
  const deleteFormId = `delete-coaching-form-${coaching.id}`;

  return (
    <Card className={"h-full"}>
      <CardHeader>
        <CardTitle className={"flex items-center gap-2 min-w-0"}>
          <span
            className={
              "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            }
          >
            <IconUserFilled className={"size-4"} />
          </span>
          <span className={"truncate"}>{coaching.title}</span>
        </CardTitle>
        <CardDescription className={"truncate"}>
          {coaching.game} • ${coaching.pricePerHour}/hr
        </CardDescription>

        <CardAction>
          <Dialog>
            <DialogTrigger render={<Button variant={"ghost"} size={"icon"} />}>
              <IconPencilFilled />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Coaching</DialogTitle>
                <DialogDescription>Edit your coaching offer.</DialogDescription>
              </DialogHeader>
              <DialogPanel>
                <EditCoachingForm
                  coachingId={coaching.id}
                  initialValues={coaching as unknown as CoachingInput}
                  formId={editFormId}
                />

                <Separator className={"my-4"} />

                <DeleteCoachingForm
                  coachingId={coaching.id}
                  userId={userId}
                  formId={deleteFormId}
                />
              </DialogPanel>
              <DialogFooter>
                <DialogClose render={<Button variant={"outline"} />}>
                  Cancel
                </DialogClose>
                <DialogClose render={<Button type={"submit"} form={editFormId} />}>
                  Save
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className={"text-sm text-muted-foreground line-clamp-4"}>
          {coaching.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function CoachingsSection({
  userId,
  coachings,
  filterGame,
}: CoachingsSectionProps) {
  const normalizedFilter = filterGame?.trim();
  const games = Array.from(
    new Set(coachings.map((c) => c.game).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredCoachings =
    normalizedFilter && normalizedFilter.length > 0
      ? coachings.filter((c) => c.game === normalizedFilter)
      : coachings;

  return (
    <section className={"px-16"}>
      <Separator className={"my-4"} />

      <div className={"flex items-center justify-between gap-4 mb-4"}>
        <h2 className={"text-xl font-bold"}>Coaching</h2>
        <Dialog>
          <DialogTrigger render={<Button variant={"outline"} size={"icon"} />}>
            <IconPlus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Coaching</DialogTitle>
              <DialogDescription>
                Add a new coaching offer to your profile.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <CreateCoachingForm userId={userId} />
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant={"outline"} />}>
                Cancel
              </DialogClose>
              <DialogClose
                render={
                  <Button type={"submit"} form={"create-coaching-form"} />
                }
              >
                Add
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {games.length > 0 && (
        <div className={"flex flex-wrap gap-2 mb-4"}>
          <Button
            render={<Link href={{ pathname: "/account" }}>All</Link>}
            variant={normalizedFilter ? "outline" : "default"}
            size={"sm"}
          />
          {games.map((game) => (
            <Button
              key={game}
              variant={normalizedFilter === game ? "default" : "outline"}
              size={"sm"}
              render={
                <Link href={{ pathname: "/account", query: { coachingGame: game } }}>
                  {game}
                </Link>
              }
            />
          ))}
        </div>
      )}

      {filteredCoachings.length === 0 ? (
        <p className={"text-sm text-muted-foreground"}>
          {normalizedFilter
            ? `No coaching offers for “${normalizedFilter}”.`
            : "No coaching offers yet."}
        </p>
      ) : (
        <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {filteredCoachings.map((coaching) => (
            <CoachingItem
              key={coaching.id}
              coaching={coaching}
              userId={userId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
