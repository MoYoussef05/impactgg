import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import React from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default async function template({ children }: TemplateProps) {
  const session = await getSession();

  if (session) {
    return redirect("/");
  }

  return <>{children}</>;
}
