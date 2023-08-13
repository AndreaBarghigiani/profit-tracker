// Utils
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

// Components
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronRight, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

const UserCard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return <div>Unauthenticated</div>;
  }

  return (
    <div className="mt-auto flex items-center gap-4 border-t">
      <Link className="group flex items-center px-4 py-2" href="/profile">
        <Avatar className="mr-4 shrink-0">
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
        <ChevronRight className="ml-4 h-5 w-5 shrink-0 group-hover:text-main-400" />
      </Link>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => signOut({ callbackUrl: window.location.origin })}
            >
              <Power className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border-foreground/20">
            <p className="text-dog-400">Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UserCard;
