import { getAchievements } from "@/actions/achievements";
import AccountHeader from "@/app/(protected)/account/_components/AccountHeader";
import AchievementsSection from "@/app/(protected)/account/_components/AchievementsSection";
import { getSession } from "@/lib/getSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const achievements = await getAchievements(session.user.id);

  return (
    <div className={"space-y-4"}>
      <AccountHeader
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
      />

      <AchievementsSection userId={session.user.id} achievements={achievements} />
    </div>
  );
}
