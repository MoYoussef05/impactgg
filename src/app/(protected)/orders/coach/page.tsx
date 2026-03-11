import { getCoachAvailability, getCoachBookings } from "@/actions/booking";
import AvailabilitySection from "@/app/(protected)/account/_components/AvailabilitySection";
import { CoachBookingsSection } from "@/app/(protected)/account/_components/BookingsSection";
import { getSession } from "@/lib/getSession";

export const metadata = {
  title: "Coaching orders",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  if (!session.user.isCoach) {
    return (
      <div className="space-y-4 px-4 py-4 sm:px-16">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Coaching orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn on coach mode from your Account page to manage coaching
            availability and bookings.
          </p>
        </div>
      </div>
    );
  }

  const [availability, bookings] = await Promise.all([
    getCoachAvailability(session.user.id),
    getCoachBookings(session.user.id),
  ]);

  return (
    <div className="space-y-4 px-4 py-4 sm:px-16">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Coaching orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your availability and incoming coaching booking requests.
        </p>
      </div>

      <AvailabilitySection
        coachId={session.user.id}
        initialAvailability={availability}
      />
      <CoachBookingsSection coachId={session.user.id} bookings={bookings} />
    </div>
  );
}

