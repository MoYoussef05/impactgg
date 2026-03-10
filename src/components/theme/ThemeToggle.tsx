"use client";

import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { IconBrightness } from "@tabler/icons-react";
import { Skeleton } from "../ui/skeleton";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Kbd } from "../ui/kbd";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useHotkey("D", handleThemeToggle);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="size-8" />;
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={handleThemeToggle}
            />
          }
        >
          <IconBrightness />
        </TooltipTrigger>
        <TooltipContent>
          <span>Toggle Theme</span>
          <Kbd className={"ml-2"}>D</Kbd>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
