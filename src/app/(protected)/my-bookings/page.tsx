import { getLearnerBookings } from "@/actions/booking";
import { LearnerBookingsSection } from "@/app/(protected)/account/_components/BookingsSection";
import { getSession } from "@/lib/getSession";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My bookings",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const bookings = await getLearnerBookings(session.user.id);

  return (
    <div className="space-y-4 px-4 py-4 sm:px-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">My bookings</h1>
      </div>
      <LearnerBookingsSection learnerId={session.user.id} bookings={bookings} />
    </div>
  );
}

