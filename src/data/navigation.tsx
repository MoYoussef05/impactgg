import {
  IconBookFilled,
  IconCompassFilled,
  IconDeviceGamepad2Filled,
  IconHomeFilled,
  IconShoppingCartFilled,
  IconUserFilled,
} from "@tabler/icons-react";

export interface SidebarNavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled: boolean;
  requiresCoach?: boolean;
}

export const SIDEBAR_NAVIGATION: SidebarNavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <IconHomeFilled />,
    disabled: false,
  },
  {
    label: "Discovery",
    href: "/discovery",
    icon: <IconCompassFilled />,
    disabled: false,
  },
  {
    label: "Guides",
    href: "/guides",
    icon: <IconBookFilled />,
    disabled: false,
  },
  {
    label: "Coaching",
    href: "/coaching",
    icon: <IconUserFilled />,
    disabled: false,
  },
  {
    label: "Games",
    href: "/games",
    icon: <IconDeviceGamepad2Filled />,
    disabled: false,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <IconShoppingCartFilled />,
    disabled: false,
  },
  {
    label: "Coaching orders",
    href: "/orders/coach",
    icon: <IconShoppingCartFilled />,
    disabled: false,
    requiresCoach: true,
  },
];
