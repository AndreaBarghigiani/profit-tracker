// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import va from "@vercel/analytics";

// Types
import type { Wallet } from "@prisma/client";
import type { MassagedSumTxItem } from "@/server/types";
import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";

// Components
import { DollarSign, DoorOpen, Banknote } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

type UserStatsDropdownProps = {
  userStats: {
    wallet: Wallet;
    interests: MassagedSumTxItem;
    totals: {
      profits: number;
      deposit: number;
      exposure: number;
    };
  };
  orientation?: "horizontal" | "vertical";
};

const UserStatsDropdown = ({
  userStats,
  orientation,
}: UserStatsDropdownProps) => {
  const { data: session } = useSession();
  const { data: user } = api.user.getRedisUser.useQuery(undefined, {
    enabled: !!session,
  });

  const wrapperClasses = cn("md:flex border-none rounded-lg hidden", {
    "flex-col h-128 w-56": orientation === "vertical",
  });

  const handleValueChange = async (value: string) => {
    if (!session?.user?.id || !user) return;

    va.track("UserStatsDropdown Value Change");

    await fetch("/api/user/setPreference", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        prefId: "stat_dropdown_selection",
        prefValue: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const userPref = user?.preferences?.stat_dropdown_selection
    ? user.preferences.stat_dropdown_selection
    : "liquid";

  return (
    <Select defaultValue={userPref} onValueChange={handleValueChange}>
      <SelectTrigger className={wrapperClasses}>
        <SelectValue
          placeholder={
            <UserCard Icon={DollarSign}>
              {currencyConverter({ amount: userStats.wallet.liquidFunds })}
            </UserCard>
          }
        />
      </SelectTrigger>
      <SelectContent className="overflow-visible border-dog-600" align="end">
        <UserSelectItem value="liquid" text="Liquid Funds">
          <UserCard Icon={DollarSign}>
            {currencyConverter({ amount: userStats.wallet.liquidFunds })}
          </UserCard>
        </UserSelectItem>

        <UserSelectItem value="exposure" text="Exposure">
          <UserCard Icon={DoorOpen}>
            {currencyConverter({ amount: userStats.totals.exposure })}
          </UserCard>
        </UserSelectItem>

        <UserSelectItem value="profits" text="Profits">
          <UserCard Icon={Banknote}>
            {currencyConverter({ amount: userStats.totals.profits })}
          </UserCard>
        </UserSelectItem>
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

const UserSelectItem = ({
  value,
  text,
  children,
}: {
  value: string;
  text: string;
  children: ReactElement;
}) => {
  const selectItemClasses = cn(
    "group cursor-pointer hover:bg-dog-800 focus:bg-dog-800",
  );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectItem className={selectItemClasses} value={value}>
            {children}
          </SelectItem>
        </TooltipTrigger>
        <TooltipContent className="border-dog-600" side="right">
          <p className="text-dog-500">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
