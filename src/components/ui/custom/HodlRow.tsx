// Utils

// Types
// import type { Token } from "@prisma/client";
import type { TokenWithoutDates } from "@/server/types";

// Components
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const HodlRow = ({ token }: { token: TokenWithoutDates }) => {
  return (
    <li className=" rounded-md border-dog-400 px-3 py-2 text-dog-400 hover:bg-main-900">
      <Link
        className="flex items-center"
        href={`/hodl/create/${token.coingecko_id}`}
      >
        {!!token.iconUrl && (
          <Image
            alt={token.name || token.symbol || "Token"}
            width={40}
            height={40}
            className="mr-2 h-8 w-8 rounded-full bg-dog-800 object-contain"
            src={token.iconUrl}
          />
        )}
        <span className="mr-2 font-semibold text-dog-300">{token.name}</span>
        <span className="mr-2 text-xs">[{token.symbol.toUpperCase()}]</span>
        <ChevronRight className="ml-auto  h-4 w-4" />
        {/* <span className="mr-2 text-xs">
          ({currencyConverter({ amount: token.latestPrice })})
        </span> */}
      </Link>
    </li>
  );
};

export default HodlRow;
