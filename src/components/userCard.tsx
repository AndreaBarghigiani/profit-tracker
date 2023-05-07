// Utils
import { useSession } from "next-auth/react";

// Components
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
const UserCard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return <div>Unauthenticated</div>;
  }

  return (
    <Link
      className="mt-auto flex items-center border-t px-4 py-2"
      href="/profile"
    >
      <Avatar className="mr-4">
        <AvatarImage
          className="h-8 w-8 rounded-full"
          src={session.user.image?.toString()}
        />
        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm">{session.user.name}</p>
        <p className="text-xs text-foreground/50">{session.user.email}</p>
      </div>
      <ChevronRight className="ml-auto h-5 w-5" />
    </Link>
  );
};

export default UserCard;
