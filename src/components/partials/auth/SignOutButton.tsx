"use client";

import { Button } from "@/components/ui/button";
import { IconLogout, IconLogout2 } from "@tabler/icons-react";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant={"destructive-outline"} onClick={handleSignOut}>
      <IconLogout />
      <span>Sign Out</span>
    </Button>
  );
}
