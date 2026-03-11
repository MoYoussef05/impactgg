import SignOutButton from "@/components/partials/auth/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccountHeaderProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function AccountHeader({ name, email, image }: AccountHeaderProps) {
  return (
    <div>
      <div className={"bg-muted rounded-md w-full h-56 relative mb-20"}>
        <Avatar
          className={
            "size-32 absolute left-16 -bottom-16 rounded-md ring-8 ring-background"
          }
        >
          <AvatarImage src={image ?? ""} alt={name ?? ""} />
          <AvatarFallback>{name?.charAt(0) ?? "?"}</AvatarFallback>
        </Avatar>
      </div>
      <div className={"px-16 flex items-center justify-between gap-4"}>
        <div>
          <h1 className={"text-2xl font-bold"}>{name}</h1>
          <p className={"text-sm text-muted-foreground"}>{email}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
