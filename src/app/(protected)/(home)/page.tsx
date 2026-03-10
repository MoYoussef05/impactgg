import SignOutButton from "@/components/partials/auth/SignOutButton";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  const session = await getSession();
  return (
    <>
      <div className={"space-y-4"}>
        <div>
          <code>
            <pre className={"text-sm text-wrap font-mono"}>
              {JSON.stringify(session, null, 2)}
            </pre>
          </code>
        </div>
        <SignOutButton />
      </div>
    </>
  );
}
