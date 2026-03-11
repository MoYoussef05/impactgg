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

export default function AppSidebar() {
  return (
    <div suppressHydrationWarning>
      <Sidebar variant={"inset"} collapsible={"icon"}>
        <SidebarHeader>
          <AppSidebarHeader />
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarContent items={SIDEBAR_NAVIGATION} />
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
