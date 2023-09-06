// Utils
import { buttonVariants } from "@/components/ui/button";

// Components
import Link from "next/link";

// Types
import type { LucideIcon } from "lucide-react";
type NavLinkProps = {
  active: boolean;
  path: string;
  label: string;
  Icon: LucideIcon;
  onClick?: () => void;
};

const NavLink = ({ active, path, label, Icon, onClick }: NavLinkProps) => {
  return (
    <li>
      <Link
        className={buttonVariants({
          variant: "ghost",
          size: "nav",
          corners: "square",
          align: "left",
          className: active ? "text-main" : "",
        })}
        href={path}
        onClick={onClick}
      >
        <Icon className="mr-2 h-4 w-4" /> {label}
      </Link>
    </li>
  );
};

export default NavLink;
