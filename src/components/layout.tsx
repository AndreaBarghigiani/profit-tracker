// Utils & Hooks
import { api } from "@/utils/api";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

// Types
// Components
import Link from "next/link";
import { Gauge, ArrowUpDown, Boxes, Coins, PiggyBank } from "lucide-react";
import Heading from "@/components/ui/heading";
import UserCard from "@/components/userCard";
const Sidebar = () => {
  const { data: userRole } = api.user.getRole.useQuery();

  return (
    <nav>
      <ul>
        <li>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "nav",
              corners: "square",
              align: "left",
            })}
            href={`/dashboard`}
          >
            <Gauge className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "nav",
              corners: "square",
              align: "left",
            })}
            href={`/projects`}
          >
            <Boxes className="mr-2 h-4 w-4" /> Projects
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "nav",
              corners: "square",
              align: "left",
            })}
            href={`/transactions`}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" /> Transactions
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "nav",
              corners: "square",
              align: "left",
            })}
            href={`/new-investment`}
          >
            <PiggyBank className="mr-2 h-4 w-4" /> New Investment
          </Link>
        </li>
        {!!userRole?.role && userRole.role === Role.ADMIN && (
          <li>
            <Link
              className={buttonVariants({
                variant: "ghost",
                size: "nav",
                corners: "square",
                align: "left",
              })}
              href={`/token/add`}
            >
              <Coins className="mr-2 h-4 w-4" /> Add New Token
            </Link>
          </li>
        )}
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
