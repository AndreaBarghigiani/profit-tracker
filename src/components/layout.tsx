// Utils & Hooks
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { AxiomWebVitals } from "next-axiom";
import { useRouter } from "next/router";

// import { Role } from "@prisma/client";

// Types

// Components
import NavLink from "./ui/custom/NavLink";
import {
  Gauge,
  ArrowUpDown,
  Boxes,
  Calculator,
  PiggyBank,
  ToyBrick,
} from "lucide-react";
import Heading from "@/components/ui/heading";
import UserCard from "@/components/userCard";
import { Separator } from "@/components/ui/separator";
import WalletInfo from "./ui/testing/WalletInfo";

const paths = [
  { path: "/dashboard", label: "Dashboard", Icon: Gauge },
  { path: "/new-investment", label: "New Investment", Icon: PiggyBank },
  { path: "/transactions", label: "Transactions", Icon: ArrowUpDown },
  { path: "/projects", label: "Projects", Icon: Boxes },
  { path: "/hodl", label: "Hodls", Icon: ToyBrick },
  { path: "/estimator", label: "Estimate", Icon: Calculator },
];

const Sidebar = () => {
  // const { data: userRole } = api.user.getRole.useQuery();
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav>
      <ul>
        {paths.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            active={currentRoute === path}
            path={path}
            label={label}
            Icon={Icon}
          />
        ))}
      </ul>

      <Separator className="my-4 bg-foreground/50" />

      <WalletInfo />
    </nav>
  );
};

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const mainClass = clsx("px-7 py-5", {
    "ml-72": status === "authenticated",
  });

  return (
    <div className="min-h-screen">
      {status === "authenticated" ? (
        <aside className="top-50 fixed left-0 flex h-full w-72 flex-col border-r border-foreground/50 bg-background">
          <div className="my-8 flex flex-col items-center justify-center gap-4">
            <svg
              className="fill-even-odd h-12 w-12"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              // style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
            >
              <path
                className="fill-[#ffcd1a]"
                d="M120.337 227.029c0-12.454-10.111-22.564-22.564-22.564H47.564C35.11 204.465 25 214.575 25 227.029v49.874c0 12.453 10.11 22.563 22.564 22.563h50.209c12.453 0 22.564-10.11 22.564-22.563v-49.874Z"
              />
              <path
                className="fill-[#ffd84d]"
                d="M207.893 223.608v-56.651c0-31.311 26.062-56.733 58.162-56.733h83.858V61.187C349.913 41.215 333.29 25 312.815 25H180.837c-20.475 0-37.098 16.215-37.098 36.187v126.235c0 19.972 16.623 36.186 37.098 36.186h27.056Z"
              />
              <path
                className="fill-[#ffe380]"
                d="M228.812 257.477h81.814c32.101 0 58.162 25.422 58.162 56.733v53.999h59.431c25.819 0 46.781-20.446 46.781-45.631V175.466c0-25.185-20.962-45.632-46.781-45.632H275.593c-25.819 0-46.781 20.447-46.781 45.632v82.011Z"
              />
              <path
                className="fill-[#ffeeb3]"
                d="M350.923 326.819c0-28.677-23.282-51.959-51.959-51.959H196.709c-28.677 0-51.96 23.282-51.96 51.959v96.222c0 28.677 23.283 51.959 51.96 51.959h102.255c28.677 0 51.959-23.282 51.959-51.959v-96.222Z"
              />
            </svg>
            <Heading className="-mt-2 bg-gradient-to-r from-main-500 to-main-300 bg-clip-text px-4 font-extrabold tracking-tight text-transparent">
              Underdog Tracker
            </Heading>
          </div>
          <Sidebar />
          <UserCard />
        </aside>
      ) : null}
      <main className={mainClass}>
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <AxiomWebVitals />
    </div>
  );
};

export default LayoutDashboard;
