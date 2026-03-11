import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getGuideById,
  getMoreFromAuthor,
  getSuggestedGuides,
} from "@/actions/guide";
import RichTextViewer from "@/components/editors/RichTextViewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{
    guideId: string;
  }>;
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { guideId } = await props.params;
  const guide = await getGuideById(guideId);

  if (!guide) {
    return {
      title: "Guide not found",
    };
  }

  return {
    title: guide.title,
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { guideId } = await params;

  const guide = await getGuideById(guideId);
  if (!guide) {
    return notFound();
  }

  const [moreFromAuthor, suggested] = await Promise.all([
    getMoreFromAuthor(guide.userId, guide.id, 3),
    getSuggestedGuides(guide.game, guide.id, 3),
  ]);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-16">
      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant={"outline"} size={"sm"}>
              {guide.game}
            </Badge>
            <span>•</span>
            <span>
              {new Date(guide.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/u/${guide.user.id}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <Avatar className="size-8 rounded-md">
                <AvatarImage src={guide.user.image ?? ""} />
                <AvatarFallback>
                  {guide.user.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">
                  {guide.user.name ?? "Unknown author"}
                </span>
              </div>
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          {guide.description && (
            <p className="text-base text-muted-foreground">{guide.description}</p>
          )}
          <RichTextViewer value={guide.content || ""} />
        </section>
      </article>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          More from {guide.user.name ?? "this author"}
        </h2>
        {moreFromAuthor.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other guides yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moreFromAuthor.map((g) => (
              <Link key={g.id} href={`/guides/${g.id}`}>
                <Card className="h-full transition hover:bg-muted/60">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">
                      {g.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {g.game}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {g.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Suggested guides</h2>
        {suggested.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suggestions yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suggested.map((g) => (
              <Link key={g.id} href={`/guides/${g.id}`}>
                <Card className="h-full transition hover:bg-muted/60">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">
                      {g.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {g.game}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {g.description}
                    </p>
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

