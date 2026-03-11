"use client";

import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-4 px-4 py-4 sm:px-16">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Switch between your bookings as a learner and as a coach.
        </p>
      </div>
      <Tabs defaultValue="learner" className="mt-2">
        <TabsList variant="underline">
          <TabsTrigger value="learner">As learner</TabsTrigger>
          <TabsTrigger value="coach">As coach</TabsTrigger>
        </TabsList>
        <TabsContent value="learner" className="mt-4">
          <p className="mb-2 text-sm text-muted-foreground">
            View and manage sessions you&apos;ve requested from coaches.
          </p>
          <Link
            href="/orders/learner"
            className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
          >
            Open learner orders
          </Link>
        </TabsContent>
        <TabsContent value="coach" className="mt-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Configure availability and respond to booking requests for your
            coaching offers.
          </p>
          <Link
            href="/orders/coach"
            className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
          >
            Open coach orders
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  );
}

