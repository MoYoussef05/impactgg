import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/getSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await getSession();

  return (
    <>
      <div>
        <div className={"bg-muted rounded-md w-full h-56 relative mb-20"}>
          <Avatar
            className={
              "size-32 absolute left-16 -bottom-16 rounded-md ring-8 ring-background"
            }
          >
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={session?.user.name ?? ""}
            />
            <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <code>
          <pre className={"text-sm text-wrap font-mono"}>
            {JSON.stringify(session, null, 2)}
          </pre>
        </code>
      </div>
    </>
  );
}
