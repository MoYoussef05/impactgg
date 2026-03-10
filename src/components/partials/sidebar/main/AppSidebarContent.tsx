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
}: {
  items: SidebarNavigationItem[];
}) {
  const pathname = usePathname();
  const isActive = (item: SidebarNavigationItem) => pathname === item.href;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
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
