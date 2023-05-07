// Utils & Hooks
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// Components
import Link from "next/link";
import { Gauge, ArrowUpDown, Boxes } from "lucide-react";
import Heading from "@/components/ui/heading";
import UserCard from "@/components/userCard";
const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/dashboard`}
          >
            <Gauge className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/projects`}
          >
            <Boxes className="mr-2 h-4 w-4" /> Projects
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/transactions`}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" /> Transactions
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  return (
    <div className="min-h-screen">
      {status === "authenticated" ? (
        <aside className="top-50 fixed left-0 flex  h-full flex-col border-r border-foreground/50 bg-background">
          <Heading className="mt-8 px-4 py-2">Underdog Tracker</Heading>
          <Sidebar />
          <UserCard />
        </aside>
      ) : null}
      <main className="mx-auto max-w-6xl p-5">{children}</main>
    </div>
  );
};

export default LayoutDashboard;
