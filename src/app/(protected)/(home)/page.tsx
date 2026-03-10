import SignOutButton from "@/components/partials/auth/SignOutButton";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  const session = await getSession();
  return (
    <>
      <div className={"container mx-auto py-4"}>
        <code>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </code>
        <SignOutButton />
      </div>
    </>
  );
}
