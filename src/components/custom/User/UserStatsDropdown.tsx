// Utils
import { currencyConverter } from "@/utils/string";
import clsx from "clsx";
import { cn } from "@/lib/utils";

// Types
import type { Wallet } from "@prisma/client";
import type { MassagedSumTxItem } from "@/server/types";
import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import type { FullPositionZod } from "@/server/types";

// Components
import { Button } from "@/components/ui/button";
import { DollarSign, DoorOpen, Banknote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UserStatsCardProps = {
  userStats: {
    wallet: Wallet;
    interests: MassagedSumTxItem;
    totals: {
      profits: number;
      deposit: number;
      exposure: number;
    };
  };
  holds: FullPositionZod[];
  orientation?: "horizontal" | "vertical";
};

const UserStatsDropdown = ({
  userStats,
  holds,
  orientation,
}: UserStatsCardProps) => {
  if (!userStats || !holds) return null;

  const wrapperClasses = clsx("md:flex border-none rounded-lg hidden", {
    "flex-col h-128 w-56": orientation === "vertical",
  });

  return (
    <Select>
      <SelectTrigger className={wrapperClasses}>
        <SelectValue
          placeholder={
            <UserCard Icon={DollarSign}>
              {currencyConverter({ amount: userStats.wallet.liquidFunds })}
            </UserCard>
          }
        />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="liquid">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserCard Icon={DollarSign}>
                  {currencyConverter({ amount: userStats.wallet.liquidFunds })}
                </UserCard>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Liquid Funds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SelectItem>
        <SelectItem value="exposure">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserCard Icon={DoorOpen}>
                  {currencyConverter({ amount: userStats.totals.exposure })}
                </UserCard>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Exposure</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SelectItem>

        <SelectItem value="profits" className="text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserCard Icon={Banknote}>
                  {currencyConverter({ amount: userStats.totals.profits })}
                </UserCard>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Profits</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserStatsDropdown;

const UserCard = ({
  Icon,
  children,
}: {
  Icon: LucideIcon;
  children: ReactElement | string;
}) => {
  const cardClasses = cn("border-none bg-none ml-auto ");
  const cardHeaderClasses = cn(
    "flex flex-row p-1 items-center space-y-0 border-dog-300",
  );
  const cardTitleClasses = cn("text-base text-dog-300 font-normal");

  return (
    <Card className={cardClasses}>
      <CardHeader className={cardHeaderClasses}>
        {!!Icon && <Icon className="mr-2 h-4 w-4 text-main-700" />}
        <CardTitle className={cardTitleClasses}>{children}</CardTitle>
      </CardHeader>
    </Card>
  );
};
