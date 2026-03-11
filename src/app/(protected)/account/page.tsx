import { getAchievements } from "@/actions/achievements";
import { getCoachings } from "@/actions/coaching";
import { getGuides } from "@/actions/guide";
import AccountHeader from "@/app/(protected)/account/_components/AccountHeader";
import AchievementsSection from "@/app/(protected)/account/_components/AchievementsSection";
import CoachingsSection from "@/app/(protected)/account/_components/CoachingsSection";
import GuidesSection from "@/app/(protected)/account/_components/GuidesSection";
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

  return (
    <div className={"space-y-4"}>
      <AccountHeader
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
      />

      <AchievementsSection userId={session.user.id} achievements={achievements} />
      <GuidesSection userId={session.user.id} guides={guides} />
      <CoachingsSection
        userId={session.user.id}
        coachings={coachings}
        filterGame={coachingGame}
      />
    </div>
  );
}
