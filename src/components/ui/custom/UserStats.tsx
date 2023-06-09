// Utils
import { currencyConverter } from "@/utils/string";
import clsx from "clsx";

// Types
import type { Wallet } from "@prisma/client";
import type { MassagedSumTxItem } from "@/server/types";
import type { ReactElement } from "react";

// Components
import Heading from "@/components/ui/heading";
import { Dumbbell, DollarSign, Percent, CalendarRange } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type UserStatsCardProps = {
  userStats: {
    wallet: Wallet;
    interests: MassagedSumTxItem;
  };
  orientation?: "horizontal" | "vertical";
};

const UserStats = ({ userStats, orientation }: UserStatsCardProps) => {
  const wrapperClasses = clsx(
    "flex justify-around rounded-lg border border-dog-800 bg-dog-900 px-5 py-3 shadow-lg",
    {
      "h-28 items-center": orientation !== "vertical",
      "flex-col h-128 w-56": orientation === "vertical",
    }
  );

  const separatorOrientation =
    orientation === "vertical" ? "horizontal" : "vertical";

  return (
    <div className={wrapperClasses}>
      <UserStatsCol
        title="Money at Work"
        value={userStats.wallet.totalDeposit}
        rightIcon={<Dumbbell className="mr-2 h-4 w-4 flex-shrink-0" />}
      />
      <Separator
        orientation={separatorOrientation}
        decorative
        className="bg-dog-600"
      />

      <UserStatsCol
        title="Profits"
        value={userStats.wallet.totalWithdraw}
        rightIcon={<DollarSign className="mr-2 h-4 w-4 flex-shrink-0" />}
      />
      <Separator
        orientation={separatorOrientation}
        decorative
        className="bg-dog-600"
      />

      <UserStatsCol
        title="Interests"
        value={userStats.interests.amount}
        rightIcon={<Percent className="mr-2 h-4 w-4 flex-shrink-0" />}
      />
      <Separator
        orientation={separatorOrientation}
        decorative
        className="bg-dog-600"
      />

      <UserStatsCol
        title="Daily Target"
        value={userStats.wallet.dailyProfit}
        rightIcon={<CalendarRange className="mr-2 h-4 w-4 flex-shrink-0" />}
      />
    </div>
  );
};

const UserStatsCol = ({
  title,
  value,
  leftIcon,
  rightIcon,
}: {
  title: string;
  value: number;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}) => {
  return (
    <div>
      <header>
        <Heading size="h3" className="mt-0 flex items-center text-dog-500">
          {!!rightIcon && rightIcon}
          {title}
          {!!leftIcon && leftIcon}
        </Heading>
      </header>

      <section>
        <p className="text-3xl font-semibold">
          {currencyConverter({ amount: value })}
        </p>
      </section>
    </div>
  );
};

export default UserStats;
