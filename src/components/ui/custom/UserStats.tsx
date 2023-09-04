// Utils
import { currencyConverter } from "@/utils/string";
import clsx from "clsx";
import { cn } from "@/lib/utils";

// Types
import type { Wallet } from "@prisma/client";
import type { MassagedSumTxItem } from "@/server/types";
import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";

// Components
import { DollarSign, DoorOpen, Banknote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  orientation?: "horizontal" | "vertical";
};

const UserStats = ({ userStats, orientation }: UserStatsCardProps) => {
  const wrapperClasses = clsx(
    "md:grid md:grid-cols-4 md:gap-4 rounded-lg space-y-4 md:space-y-0",
    {
      "flex-col h-128 w-56": orientation === "vertical",
    },
  );

  return (
    <div className={wrapperClasses}>
      <UserCard title="Liquid Funds" Icon={DollarSign}>
        <div className="text-3xl font-bold">
          {currencyConverter({ amount: userStats.wallet.liquidFunds })}
        </div>
      </UserCard>

      <UserCard title="Exposed" Icon={DoorOpen}>
        <div className="text-3xl font-bold">
          {currencyConverter({ amount: userStats.totals.exposure })}
        </div>
      </UserCard>

      <UserCard title="Profits" Icon={Banknote}>
        <div className="text-3xl font-bold">
          {currencyConverter({ amount: userStats.totals.profits })}
        </div>
      </UserCard>

      <UserCard title="Your next idea...">
        <p className="text-center text-sm">
          What would you improve?
          <br /> Send us a feedback.
        </p>
      </UserCard>
    </div>
  );
};

export default UserStats;

const UserCard = ({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon?: LucideIcon;
  children: ReactElement;
}) => {
  const cardClasses = cn({
    "border-2 border-dashed": !Icon,
  });
  const cardHeaderClasses = cn("flex flex-row items-stretch space-y-0 ", {
    "justify-between pb-2": !!Icon,
    "justify-center p-5 pb-1": !Icon,
  });
  const cardTitleClasses = cn("text-xl", {
    "text-dog-300": !!Icon,
    "text-dog-500": !Icon,
  });
  const cardContentClasses = cn({
    "text-dog-500": !!Icon,
    "text-dog-600": !Icon,
  });

  return (
    <Card className={cardClasses}>
      <CardHeader className={cardHeaderClasses}>
        <CardTitle className={cardTitleClasses}>{title}</CardTitle>
        {!!Icon && <Icon className="z-20 h-6 w-6 text-main-700" />}
      </CardHeader>
      <CardContent className={cardContentClasses}>{children}</CardContent>
    </Card>
  );
};
