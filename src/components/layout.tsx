// Utils & Hooks
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useRouter } from "next/router";

// import { Role } from "@prisma/client";

// Types

// Components
import Link from "next/link";
import NavLink from "@/components/ui/custom/NavLink";
import {
  Gauge,
  ArrowUpDown,
  Boxes,
  Calculator,
  PiggyBank,
  ToyBrick,
  Gift,
  Menu,
  Power,
  User2,
} from "lucide-react";
import WalletInfo from "@/components/ui/testing/WalletInfo";
import FeedbackComponent from "@/components/ui/custom/Feedback";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChangesModal from "@/components/ui/custom/ChangesModal";

const paths = [
  { path: "/dashboard", label: "Dashboard", Icon: Gauge },
  { path: "/new-investment", label: "New Investment", Icon: PiggyBank },
  { path: "/transactions", label: "Transactions", Icon: ArrowUpDown },
  { path: "/projects", label: "Projects", Icon: Boxes },
  { path: "/hodl", label: "Hodls", Icon: ToyBrick },
  { path: "/estimator", label: "Estimate", Icon: Calculator },
  { path: "/airdrop", label: "Airdrop", Icon: Gift },
];

const Sidebar = ({ linkClicked }: { linkClicked?: () => void }) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav className="my-4 flex flex-col justify-center gap-4">
      <ul>
        {paths.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            active={currentRoute === path}
            path={path}
            label={label}
            Icon={Icon}
            onClick={linkClicked}
          />
        ))}
      </ul>

      {/* <Separator className="my-4 bg-foreground/50" /> */}

      <WalletInfo />
    </nav>
  );
};

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const mainClass = clsx("px-7 py-5", {
    "xl:ml-72": status === "authenticated",
  });

  const handleSheetOpen = () => {
    setSheetOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen">
      {status === "authenticated" ? (
        <aside className="top-50 fixed left-0 hidden h-full flex-col border-r border-foreground/50 bg-background md:w-72 xl:flex">
          <Sidebar />
        </aside>
      ) : null}

      <main className={mainClass}>
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto mb-6 flex items-center py-4">
            <div className="flex items-center gap-4">
              <svg
                className="h-8 w-8"
                viewBox="0 0 500 500"
                xmlns="http://www.w3.org/2000/svg"
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

              <div className="flex items-center">
                <h1 className="bg-gradient-to-r from-main-500 to-main-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                  Underdog Tracker
                </h1>

                <span className="-translate-x-4 -translate-y-5 rotate-12 scale-75 rounded-3xl border border-main-500 px-2 py-1 text-xs text-main-600">
                  beta
                </span>
              </div>
            </div>

            <nav className="ml-auto flex items-center gap-4">
              <FeedbackComponent />

              <ChangesModal session={session} />

              {!!session && (
                <Popover>
                  <PopoverTrigger>
                    <Avatar className="shrink-0 items-center justify-center">
                      <AvatarImage
                        className="h-8 w-8 rounded-full transition-all hover:shadow-dog"
                        src={session.user.image?.toString()}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="w-fit space-y-2 border-dog-750 px-6 py-3 text-sm text-dog-300"
                    sideOffset={10}
                  >
                    <Link
                      className="flex items-center hover:text-main-500"
                      href="/profile"
                    >
                      <User2 className="mr-2 h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      className="flex items-center hover:text-main-500"
                      href="/"
                      onClick={() =>
                        signOut({ callbackUrl: window.location.origin })
                      }
                    >
                      <Power className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </PopoverContent>
                </Popover>
              )}

              <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
                <SheetTrigger className="xl:hidden">
                  <Menu />
                </SheetTrigger>
                <SheetContent side="left">
                  <Sidebar linkClicked={handleSheetOpen} />
                </SheetContent>
              </Sheet>
            </nav>
          </header>

          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutDashboard;
