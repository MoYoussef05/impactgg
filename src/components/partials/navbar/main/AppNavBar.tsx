import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/getSession";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppNavBar() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <header
      className={
        "w-full sticky top-0 z-50 bg-linear-to-b from-background to-transparent"
      }
    >
      <nav className={"flex items-center justify-between w-full h-full p-4"}>
        <div>
          <SidebarTrigger />
        </div>
        <div className={"flex items-center gap-2"}>
          <Avatar className={"size-8 rounded-md"}>
            <AvatarImage
              src={session.user.image ?? ""}
              alt={session.user.name}
            />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className={"text-sm font-medium"}>{session.user.name}</p>
            <p className={"text-xs text-muted-foreground"}>
              {session.user.email}
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
