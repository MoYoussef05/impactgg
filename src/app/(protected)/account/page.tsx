import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/getSession";
import {
  IconBriefcase2Filled,
  IconPlus,
  IconTrophyFilled,
} from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <div className={"space-y-4"}>
        <div>
          <div className={"bg-muted rounded-md w-full h-56 relative mb-20"}>
            <Avatar
              className={
                "size-32 absolute left-16 -bottom-16 rounded-md ring-8 ring-background"
              }
            >
              <AvatarImage
                src={session?.user.image ?? ""}
                alt={session?.user.name ?? ""}
              />
              <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className={"px-16"}>
            <h1 className={"text-2xl font-bold"}>{session?.user.name}</h1>
            <p className={"text-sm text-muted-foreground"}>
              {session?.user.email}
            </p>
          </div>
        </div>
        <section className={"px-16"}>
          <Separator className={"my-4"} />
          <div className={"flex items-center justify-between gap-4"}>
            <div>
              <h2 className={"text-lg font-bold"}>Achievements</h2>
            </div>
            <Menu>
              <MenuTrigger
                render={<Button variant={"outline"} size={"icon"} />}
              >
                <IconPlus />
              </MenuTrigger>
              <MenuPopup side={"bottom"} align={"end"}>
                <MenuGroup>
                  <MenuGroupLabel>Add Achievement</MenuGroupLabel>
                  <MenuItem>
                    <IconBriefcase2Filled />
                    <span>General Achievement</span>
                  </MenuItem>
                  <MenuItem>
                    <IconTrophyFilled />
                    <span>Tournament Achievement</span>
                  </MenuItem>
                </MenuGroup>
              </MenuPopup>
            </Menu>
          </div>
        </section>
      </div>
    </>
  );
}
