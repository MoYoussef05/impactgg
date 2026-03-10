import { IconCompassFilled, IconHomeFilled } from "@tabler/icons-react";

export interface SidebarNavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled: boolean;
}

export const SIDEBAR_NAVIGATION: SidebarNavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <IconHomeFilled />,
    disabled: false,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: <IconCompassFilled />,
    disabled: false,
  },
];
