"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export default function AppNavBarBreadCrumb() {
  const pathname = usePathname();

  return (
    <Breadcrumb className={"hidden md:block"}>
      <BreadcrumbList>
        {pathname
          .split("/")
          .filter((part) => part)
          .map((part, idx, arr) => {
            const href = `/${arr.slice(0, idx + 1).join("/")}`;
            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={href}>
                    {part
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {idx < arr.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
