/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Utils
import { api } from "@/utils/api";
import { currencyConverter, formatNumber } from "@/utils/string";
import clsx from "clsx";

// Types
import type { HodlWithoutDates, TokenWithoutDates } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Skeleton } from "../skeleton";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  ChartTooltip,
  Filler,
);

type HodlStatsCardProps = {
  hodl: HodlWithoutDates;
  token: TokenWithoutDates;
};

const HodlStats = ({ hodl, token }: HodlStatsCardProps) => {
  const { data: avgPrice, isSuccess: isAvgPriceSuccess } =
    api.hodl.getDiffFromBuyes.useQuery(
      {
        hodlId: hodl.id,
        hodlAmount: hodl.amount,
        tokenLatestPrice: token.latestPrice,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  const { data: chartData, isSuccess: isChartDataSuccess } =
    api.token.getChartData.useQuery(
      { tokenId: token.coingecko_id, tokenName: token.name },
      {
        refetchOnWindowFocus: false,
        enabled: !token.coingecko_id.startsWith("custom-"),
      },
    );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            if (!!context && typeof context?.raw === "number") {
              return currencyConverter({ amount: context.raw, type: "long" });
            }
          },
        },
      },
    },
    scales: {
      x: { border: { color: "#7b7e68" }, grid: { color: "#292a23" } },
      y: { border: { color: "#7b7e68" }, grid: { color: "#292a23" } },
    },
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {/* Overview box */}
        <div className="rounded-lg border border-dog-800 bg-dog-900 p-5">
          <Heading
            size="h3"
            spacing="small"
            className="flex justify-between text-dog-500"
          >
            Overview
          </Heading>
          <div className="flex flex-col space-y-2">
            <Heading size="h1" className="flex flex-col text-dog-500">
              <p className="text-dog-200">
                {currencyConverter({ amount: hodl.amount * token.latestPrice })}
              </p>

              {isAvgPriceSuccess ? (
                <div className="flex items-center">
                  <p
                    className={clsx("text-sm font-normal", {
                      "text-success-700": avgPrice.positive,
                      "text-red-400": !avgPrice.positive,
                    })}
                  >
                    {currencyConverter({
                      amount: avgPrice.diff,
                      showSign: true,
                    })}
                  </p>
                  <p
                    className={clsx("ml-2 text-xs font-semibold", {
                      "text-success-700": avgPrice.positive,
                      "text-red-400": !avgPrice.positive,
                    })}
                  >
                    ({avgPrice.positive && "+"}
                    {avgPrice.percentage}%)
                  </p>
                </div>
              ) : (
                <Skeleton as="p" className=" h-[20px] w-1/2 bg-foreground/50" />
              )}
            </Heading>
          </div>

          <Heading size="h4" className="flex items-center text-dog-500">
            Available
          </Heading>
          <p className="text-3xl font-semibold">{formatNumber(hodl.amount)}</p>
        </div>
        <div className="col-span-4 h-80 rounded-lg border border-dog-800 bg-dog-900 p-5">
          <Heading size="h3" spacing="small" className="text-dog-500">
            Performance
          </Heading>

          {isChartDataSuccess ? (
            <div className="mt-4 h-64 w-full">
              <Line options={chartOptions} data={chartData} />
            </div>
          ) : (
            <div className="relative flex h-full items-center justify-center">
              <Image
                alt={token.name || token.symbol || "Token"}
                width={1000}
                height={300}
                className="absolute opacity-25"
                src={"/no-chart-custom-token.jpg"}
              />
              <p className="relative -rotate-3 rounded-full bg-black/25 p-6 text-center text-2xl text-alert-600 shadow-2xl backdrop-blur-sm backdrop-filter">
                <span className="font-semibold italic">
                  No chart for custom tokens
                </span>{" "}
                😞
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HodlStats;
