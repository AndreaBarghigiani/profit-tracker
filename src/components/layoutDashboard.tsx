// Utils
import { buttonVariants } from "@/components/ui/button";

// Components
import Link from "next/link";
import { Home, ArrowUpDown } from "lucide-react";
const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link className={buttonVariants({ variant: "ghost" })} href={`/`}>
            <Home className="mr-2 h-4 w-4" /> Home
          </Link>
        </li>
        <li>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/transaction`}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" /> Transactions
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen gap-4">
      <aside className="relative w-60 p-5">
        <Sidebar />
      </aside>
      <main className="mx-auto max-w-6xl flex-grow p-5">{children}</main>
    </div>
  );
};

export default LayoutDashboard;
