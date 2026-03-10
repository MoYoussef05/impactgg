import SignInForm from "@/components/partials/auth/SignInForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Page() {
  return (
    <>
      <div
        className={"w-full h-screen flex items-center justify-center relative"}
      >
        <SignInForm />
        <Alert
          className={"w-full max-w-sm absolute bottom-4 right-4"}
          variant={"info"}
        >
          <IconAlertCircle />
          <AlertTitle>
            <AlertTitle>
              <span>Notice</span>
            </AlertTitle>
            <AlertDescription>
              Currently, only Discord accounts are supported. This feature is
              available for demonstration purposes only.
            </AlertDescription>
          </AlertTitle>
        </Alert>
      </div>
    </>
  );
}
