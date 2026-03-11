import { getAchievements } from "@/actions/achievements";
import { getCoachings } from "@/actions/coaching";
import { getGuides } from "@/actions/guide";
import { getCoachAvailability, getCoachBookings } from "@/actions/booking";
import AccountHeader from "@/app/(protected)/account/_components/AccountHeader";
import AchievementsSection from "@/app/(protected)/account/_components/AchievementsSection";
import AvailabilitySection from "@/app/(protected)/account/_components/AvailabilitySection";
import CoachingsSection from "@/app/(protected)/account/_components/CoachingsSection";
import { CoachBookingsSection } from "@/app/(protected)/account/_components/BookingsSection";
import GuidesSection from "@/app/(protected)/account/_components/GuidesSection";
import { CoachModeToggle } from "@/app/(protected)/account/_components/CoachModeToggle";
import { getSession } from "@/lib/getSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const sp = (await searchParams) ?? {};
  const coachingGame =
    typeof sp.coachingGame === "string" ? sp.coachingGame : undefined;

  const achievements = await getAchievements(session.user.id);
  const guides = await getGuides(session.user.id);
  const coachings = await getCoachings(session.user.id);
  const availability = await getCoachAvailability(session.user.id);
  const bookings = await getCoachBookings(session.user.id);
  const isCoach = session.user.isCoach === true;

  return (
    <div className={"space-y-4"}>
      <AccountHeader
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
      />

      <AchievementsSection
        userId={session.user.id}
        achievements={achievements}
      />
      <GuidesSection userId={session.user.id} guides={guides} />
      <CoachModeToggle initialIsCoach={isCoach} />
      {isCoach && (
        <>
          <AvailabilitySection
            coachId={session.user.id}
            initialAvailability={availability}
          />
          <CoachingsSection
            userId={session.user.id}
            coachings={coachings}
            filterGame={coachingGame}
          />
          <CoachBookingsSection coachId={session.user.id} bookings={bookings} />
        </>
      )}
    </div>
  );
}
