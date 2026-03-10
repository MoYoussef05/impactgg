"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import {
  IconBrandDiscordFilled,
  IconBrandGoogleFilled,
  IconBrandTwitch,
} from "@tabler/icons-react";
import React from "react";
import Logo from "../assets/Logo";

export default function SignInForm() {
  const handleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  };

  return (
    <>
      <div className={"w-full max-w-md space-y-8"}>
        <div className={"space-y-2 flex flex-col items-center justify-center"}>
          <Logo className={"size-28"} />
          <h1 className={"text-4xl font-bold"}>Sign In</h1>
          <p className={"text-sm text-muted-foreground"}>
            Sign in to your account to continue
          </p>
        </div>
        <div className={"space-y-4 w-full"}>
          <div className={"space-y-2"}>
            <Label className={"text-sm font-medium"}>Continue with</Label>
            <div className={"grid grid-cols-3 gap-2"}>
              <Button variant={"outline"} onClick={handleSignIn}>
                <IconBrandDiscordFilled />
                <span>Discord</span>
              </Button>
              <Button variant={"outline"} disabled>
                <IconBrandGoogleFilled />
                <span>Google</span>
              </Button>
              <Button variant={"outline"} disabled>
                <IconBrandTwitch />
                <span>Twitch</span>
              </Button>
            </div>
          </div>
          <div className={"flex items-center gap-2 w-full"}>
            <Separator className={"flex-1"} />
            <span className={"text-sm font-medium"}>OR</span>
            <Separator className={"flex-1"} />
          </div>
          <div className={"space-y-2"}>
            <Label className={"text-sm font-medium"}>Enter your email</Label>
            <Input type={"email"} placeholder={"Email"} disabled />
          </div>
        </div>
      </div>
    </>
  );
}
