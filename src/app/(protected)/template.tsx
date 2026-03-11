import AppNavBar from "@/components/partials/navbar/main/AppNavBar";
import AppSidebar from "@/components/partials/sidebar/main/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import React from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default async function template({ children }: TemplateProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset
          className={"h-[calc(100vh-1rem)] overflow-clip overflow-y-auto"}
        >
          <AppNavBar />
          <main className={"p-4"}>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
