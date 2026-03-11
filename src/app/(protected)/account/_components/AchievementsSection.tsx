import CreateAchievementForm from "@/components/forms/achievement/CreateAchievementForm";
import DeleteAchievementForm from "@/components/forms/achievement/DeleteAchievementForm";
import EditAchievementForm from "@/components/forms/achievement/EditAchievementForm";
import { Button } from "@/components/ui/button";
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
import { AchievementInput } from "@/validators/achievement";
import {
  IconMedal2,
  IconPencilFilled,
  IconPlus,
  IconTrophyFilled,
} from "@tabler/icons-react";
import type { Achievement } from "@/generated/prisma/client";

type AchievementsSectionProps = {
  userId: string;
  achievements: Achievement[];
};

function AchievementIcon({ type }: { type: Achievement["type"] }) {
  return type === "GENERAL" ? <IconMedal2 /> : <IconTrophyFilled />;
}

function AchievementItem({
  achievement,
  userId,
}: {
  achievement: Achievement;
  userId: string;
}) {
  const editFormId = `edit-achievement-form-${achievement.id}`;
  const deleteFormId = `delete-achievement-form-${achievement.id}`;

  return (
    <div className={"space-y-2"}>
      <div className={"flex items-center justify-between gap-4"}>
        <div className={"flex items-center gap-4 min-w-0"}>
          <div
            className={
              "flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0"
            }
          >
            <AchievementIcon type={achievement.type} />
          </div>
          <div className={"min-w-0"}>
            <h3 className={"text-lg font-semibold truncate"}>
              {achievement.game?.trim() || "Achievement"}
            </h3>
            {achievement.year != null && (
              <p className={"text-xs text-muted-foreground"}>
                {achievement.year}
              </p>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger render={<Button variant={"ghost"} size={"icon"} />}>
            <IconPencilFilled />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Achievement</DialogTitle>
              <DialogDescription>Edit the achievement.</DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <EditAchievementForm
                achievementId={achievement.id}
                initialValues={achievement as unknown as AchievementInput}
                formId={editFormId}
              />

              <Separator className={"my-4"} />

              <DeleteAchievementForm
                achievementId={achievement.id}
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
      </div>

      {achievement.description?.trim() && <p>{achievement.description}</p>}
    </div>
  );
}

export default function AchievementsSection({
  userId,
  achievements,
}: AchievementsSectionProps) {
  return (
    <section className={"px-16"}>
      <Separator className={"my-4"} />

      <div className={"flex items-center justify-between gap-4 mb-4"}>
        <h2 className={"text-xl font-bold"}>Achievements</h2>
        <Dialog>
          <DialogTrigger render={<Button variant={"outline"} size={"icon"} />}>
            <IconPlus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Achievement</DialogTitle>
              <DialogDescription>
                Add a new achievement to your account.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <CreateAchievementForm userId={userId} />
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant={"outline"} />}>
                Cancel
              </DialogClose>
              <DialogClose
                render={
                  <Button type={"submit"} form={"create-achievement-form"} />
                }
              >
                Add
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {achievements.length === 0 ? (
        <p className={"text-sm text-muted-foreground"}>No achievements yet.</p>
      ) : (
        <div className={"space-y-4"}>
          {achievements.map((achievement, index) => (
            <div key={achievement.id}>
              <AchievementItem achievement={achievement} userId={userId} />
              {index !== achievements.length - 1 && (
                <Separator className={"my-2 mx-auto"} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
