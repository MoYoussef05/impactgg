import { getUser } from "@/actions/user";
import AccountHeader from "@/app/(protected)/account/_components/AccountHeader";
import { RequestBookingForm } from "@/components/forms/coaching/RequestBookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import UserGuidesList from "../UserGuidesList";
import { getSession } from "@/lib/getSession";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const user = await getUser(slug);

  if (!user) {
    return {
      title: "User not found",
    };
  }

  return {
    title: user.name ?? "Player profile",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const user = await getUser(slug);

  if (!user) {
    return notFound();
  }

  const primaryCoaching = user.coaching[0] ?? null;

  return (
    <div className={"space-y-6 px-4 py-4 sm:px-16"}>
      <AccountHeader
        name={user.name}
        email={user.email}
        image={user.image ?? null}
      />

      <section>
        <Separator className={"my-4"} />
        <h2 className={"mb-3 text-lg font-semibold"}>Achievements</h2>
        {user.achievements.length === 0 ? (
          <p className={"text-sm text-muted-foreground"}>
            No achievements shared yet.
          </p>
        ) : (
          <div className={"space-y-2"}>
            {user.achievements.map((ach) => (
              <Card key={ach.id}>
                <CardHeader>
                  <CardTitle className={"text-sm"}>
                    {ach.game || "Achievement"}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={"space-y-1 text-sm text-muted-foreground"}
                >
                  {ach.year != null && <p>Year: {ach.year}</p>}
                  {ach.description && <p>{ach.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <Separator className={"my-4"} />
        <h2 className={"mb-3 text-lg font-semibold"}>Guides</h2>
        <UserGuidesList userId={user.id} />
      </section>

      <section>
        <Separator className={"my-4"} />
        <h2 className={"mb-3 text-lg font-semibold"}>Coaching</h2>
        {user.coaching.length === 0 ? (
          <p className={"text-sm text-muted-foreground"}>
            No coaching services yet.
          </p>
        ) : (
          <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
            {user.coaching.map((c) => (
              <Card key={c.id} className="h-full transition hover:bg-muted/60">
                <CardHeader>
                  <CardTitle className={"text-sm"}>{c.title}</CardTitle>
                </CardHeader>
                <CardContent
                  className={"space-y-1 text-xs text-muted-foreground"}
                >
                  <p>
                    {c.game} • ${c.pricePerHour}/hr
                  </p>
                  <p className={"line-clamp-2"}>{c.description}</p>
                  <Link
                    href={`/coaching?games=${encodeURIComponent(c.game)}`}
                    className="text-xs font-medium text-primary underline underline-offset-2"
                  >
                    View in coaching marketplace
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

async function ProfileBookingSection(props: {
  primaryCoachingId: string;
  coachId: string;
  game: string;
  coachName: string | null;
}) {
  const { primaryCoachingId, coachId, game, coachName } = props;
  const session = await getSession();

  if (!session) {
    return null;
  }
  const learnerId = session?.user.id;
  const learnerEmail = session?.user.email;

  if (!learnerId) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Sign in to request a session with this coach.
        </p>
        <Link href="/sign-in">
          <Button size="xs" variant="outline">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="xs" variant="default">
            Request coaching session
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Request a session with {coachName ?? "this coach"}
          </DialogTitle>
        </DialogHeader>
        <DialogPanel>
          <RequestBookingForm
            coachingId={primaryCoachingId}
            coachId={coachId}
            game={game}
            learnerId={learnerId}
            learnerEmail={learnerEmail ?? undefined}
          />
        </DialogPanel>
      </DialogContent>
    </Dialog>
  );
}
