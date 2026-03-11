import { getUser } from "@/actions/user";
import AccountHeader from "@/app/(protected)/account/_components/AccountHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import Link from "next/link";
import UserGuidesList from "../UserGuidesList";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const user = await getUser(slug);

  if (!user) {
    return notFound();
  }

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
                <CardContent className={"space-y-1 text-sm text-muted-foreground"}>
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
              <Link key={c.id} href={`/coaching?q=${encodeURIComponent(c.game)}`}>
                <Card className="h-full transition hover:bg-muted/60">
                  <CardHeader>
                    <CardTitle className={"text-sm"}>{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className={"space-y-1 text-xs text-muted-foreground"}>
                    <p>
                      {c.game} • ${c.pricePerHour}/hr
                    </p>
                    <p className={"line-clamp-2"}>{c.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
