"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarNavigationItem } from "@/data/navigation";
import { usePathname } from "next/navigation";

export default function AppSidebarContent({
  items,
  isCoach,
}: {
  items: SidebarNavigationItem[];
  isCoach: boolean;
}) {
  const pathname = usePathname();
  const isActive = (item: SidebarNavigationItem) => pathname === item.href;

  const visibleItems = items.filter((item) => !item.requiresCoach || isCoach);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <a href={item.href}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive(item)}
                  disabled={item.disabled}
                >
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
