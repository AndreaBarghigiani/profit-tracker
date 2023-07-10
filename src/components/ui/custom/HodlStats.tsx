// Utils
import { api } from "@/utils/api";
import { currencyConverter, formatNumber } from "@/utils/string";
import clsx from "clsx";

// Types
import type { HodlWithoutDates, TokenWithoutDates } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
// import { AlertTriangle, Glasses } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../skeleton";

type HodlStatsCardProps = {
  hodl: HodlWithoutDates;
  token: TokenWithoutDates;
};

type SellAll = {
  value: number;
  positive: boolean;
};

const HodlStats = ({ hodl, token }: HodlStatsCardProps) => {
  const { data: avgPrice, isSuccess: isAvgPriceSuccess } =
    api.hodl.getAverageBuyPrice.useQuery({ hodlId: hodl.id });
  const wrapperClasses = clsx(
    "flex justify-around rounded-lg border border-dog-800 bg-dog-900 py-5 shadow-lg"
  );

  let test: SellAll = {} as SellAll;

  const sellAll = (amount: number, latestPrice: number, avgPrice: number) => {
    const currentHodlValue = amount * latestPrice;
    const averagedHodlValue = amount * avgPrice;

    return {
      value: currentHodlValue - averagedHodlValue,
      positive: currentHodlValue > averagedHodlValue,
    };
  };

  if (isAvgPriceSuccess) {
    test = sellAll(hodl.amount, token.latestPrice, avgPrice);
  }

  const separatorOrientation = "vertical";
  const verticalSeparatorClasses = clsx("bg-dog-600 h-48");

  return (
    <>
      <div className={wrapperClasses}>
        <div className="flex flex-col justify-center">
          {/* <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
            General exposuresj
          </Heading>
        </header> */}

          <section>
            <Heading size="h4" className="flex items-center text-dog-500">
              Token price
            </Heading>
            <p className="text-3xl font-semibold">
              {currencyConverter({
                amount: token.latestPrice,
              })}
            </p>
            <Heading size="h4" className="flex items-center text-dog-500">
              Average buy price
            </Heading>
            <p className="text-3xl font-semibold">
              {isAvgPriceSuccess
                ? currencyConverter({ amount: avgPrice })
                : "Loading..."}
            </p>
            {/* Hide behind "Show more" 
          <Separator
            orientation="horizontal"
            decorative
            className=" mt-2 bg-dog-600"
          />

          <Heading size="h4" className="flex items-center text-dog-500">
            Deposits
            <span className="ml-2 text-xs font-light text-dog-400">
              {/* (Unlocks in 7 days) 
            </span>
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: hodl.deposit })}
					</p>
					*/}
          </section>
        </div>

        <Separator
          orientation={separatorOrientation}
          decorative
          className={verticalSeparatorClasses}
        />

        <div className="flex flex-col justify-center">
          {/* <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
            General exposures
          </Heading>
        </header> */}

          <section>
            <Heading size="h4" className="flex items-center text-dog-500">
              My bag value
            </Heading>
            <p className="text-3xl font-semibold">
              {currencyConverter({
                amount: hodl.amount * Number(token.latestPrice),
              })}
            </p>

            <Heading size="h4" className="flex items-center text-dog-500">
              Available
            </Heading>
            <p className="text-3xl font-semibold">
              {formatNumber(hodl.amount)} {token.name}
            </p>

            {/* Hide behind "Show more" 
          <Separator
            orientation="horizontal"
            decorative
            className="mt-2 bg-dog-600"
          />

          <Heading size="h4" className="flex items-center text-dog-500">
            Total Interests
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: 150 })}
            <span className="ml-2 text-xs font-light text-dog-400">fixed</span>
					</p>
					*/}
          </section>
        </div>

        <Separator
          orientation={separatorOrientation}
          decorative
          className={verticalSeparatorClasses}
        />

        <div className="flex flex-col justify-center">
          {/* <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <Glasses className="mr-2 h-4 w-4 flex-shrink-0" />
            hodl details
          </Heading>
        </header> */}

          <section>
            {hodl.exposure > 0 ? (
              <>
                <Heading size="h4" className="flex items-center text-dog-500">
                  Exposure
                </Heading>
                <p className="text-3xl font-semibold">
                  {currencyConverter({ amount: hodl.exposure })}
                </p>
              </>
            ) : (
              <>
                <Heading size="h4" className="flex items-center text-dog-500">
                  Profits
                </Heading>
                <p className="text-3xl font-semibold">
                  {currencyConverter({ amount: hodl.profits })}
                </p>
              </>
            )}
            <Heading size="h4" className="flex items-center text-dog-500">
              Predicted profits
            </Heading>
            <p className="text-3xl font-semibold">
              {currencyConverter({
                amount: test.value,
              })}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default HodlStats;
