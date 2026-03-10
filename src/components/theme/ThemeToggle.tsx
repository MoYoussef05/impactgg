"use client";

import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { IconBrightness } from "@tabler/icons-react";
import { Skeleton } from "../ui/skeleton";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="size-8" />;
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <Button size={"icon"} variant={"ghost"} onClick={handleThemeToggle}>
        <IconBrightness />
      </Button>
    </>
  );
}
