import { getLearnerBookings } from "@/actions/booking";
import { LearnerBookingsSection } from "@/app/(protected)/account/_components/BookingsSection";
import { getSession } from "@/lib/getSession";

export const metadata = {
  title: "My coaching orders",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const bookings = await getLearnerBookings(session.user.id);

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const accepted = bookings.filter((b) => b.status === "ACCEPTED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="space-y-4 px-4 py-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          My coaching orders
        </h1>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-3 py-1">
            Pending: {pending}
          </span>
          <span className="rounded-full border px-3 py-1">
            Accepted: {accepted}
          </span>
          <span className="rounded-full border px-3 py-1">
            Completed: {completed}
          </span>
        </div>
      </div>

      <LearnerBookingsSection learnerId={session.user.id} bookings={bookings} />
    </div>
  );
}

