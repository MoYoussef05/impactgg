import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import AppSidebarContent from "./AppSidebarContent";
import { SIDEBAR_NAVIGATION } from "@/data/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getSession } from "@/lib/getSession";

export default async function AppSidebar() {
  const session = await getSession();
  const isCoach = session?.user.isCoach ?? false;

  return (
    <div suppressHydrationWarning>
      <Sidebar variant={"inset"} collapsible={"icon"}>
        <SidebarHeader>
          <AppSidebarHeader />
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarContent items={SIDEBAR_NAVIGATION} isCoach={isCoach} />
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
