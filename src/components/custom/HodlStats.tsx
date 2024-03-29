// Utils
import { api } from "@/utils/api";
import { currencyConverter, formatNumber } from "@/utils/string";
import clsx from "clsx";
import { cn } from "@/lib/utils";

// Types
import type { HodlWithoutDates, TokenWithoutDates } from "@/server/types";
import type { AxisDomain } from "recharts/types/util/types";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Components
import Heading from "@/components/ui/heading";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
        enabled: !!token,
      },
    );

  const setDomain = (data: AxisDomain): [number, number] => {
    const min = Number(data[0]);
    const max = Number(data[1]);
    const buildMin = min - (min * 1) / 100;
    const buildMax = max + (max * 1) / 100;

    return [buildMin, buildMax];
  };

  return (
    <>
      <div className="xl:grid xl:grid-cols-5 xl:gap-4">
        {/* Overview box */}
        <div className="mb-4 flex justify-between rounded-lg border border-dog-800 bg-dog-900 p-5 xl:mb-0 xl:flex-col">
          <div>
            <Heading
              size="h3"
              spacing="small"
              className="flex justify-between text-dog-500"
            >
              Overview
            </Heading>

            <Heading
              size="h1"
              spacing="none"
              className="flex flex-col text-dog-200"
            >
              {currencyConverter({ amount: hodl.amount * token.latestPrice })}
            </Heading>

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
                    removeZeros: true,
                  })}
                </p>
                <p
                  className={clsx("ml-2 text-xs font-semibold", {
                    "text-success-700": avgPrice.positive,
                    "text-red-400": !avgPrice.positive,
                  })}
                >
                  ({avgPrice.positive && "+"}
                  {avgPrice.percentage.toFixed(2)}%)
                </p>
              </div>
            ) : (
              <Skeleton as="p" className=" h-[20px] w-1/2 bg-foreground/50" />
            )}
          </div>

          {isAvgPriceSuccess && (
            <div>
              <Heading
                size="h4"
                spacing="small"
                className="flex items-center text-dog-500"
              >
                Average Buy Price
              </Heading>
              <p className="text-3xl font-semibold">
                {currencyConverter({
                  amount: avgPrice.average,
                  removeZeros: true,
                })}
              </p>
            </div>
          )}

          <div>
            <Heading
              size="h4"
              spacing="small"
              className="flex items-center text-dog-500"
            >
              Tokens Available
            </Heading>
            <p className="text-3xl font-semibold">
              {formatNumber(hodl.amount)}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "col-span-4 rounded-lg border border-dog-800 bg-dog-900 p-5",
            {
              "h-fit": !isChartDataSuccess,
              "h-80": isChartDataSuccess,
            },
          )}
        >
          <Heading size="h3" spacing="small" className="text-dog-500">
            24h Performance
          </Heading>

          {isChartDataSuccess && chartData[0] !== undefined && (
            <ResponsiveContainer className="h-80" width="100%" height="100%">
              <AreaChart
                width={800}
                height={200}
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 50,
                }}
              >
                <defs>
                  <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b38c00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#b38c00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis className="text-xs" dataKey="date" hide />
                <YAxis dataKey="price" domain={setDomain} hide />
                <Tooltip
                  cursor={{ stroke: "#4d3c00", strokeWidth: 1 }}
                  content={<CustomTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  dot={false}
                  stroke="#ffcd1a"
                  strokeWidth={1.2}
                  fillOpacity={1}
                  fill="url(#colorChart)"
                  activeDot={{
                    r: 4,
                    style: {
                      fill: "#ffcd1a",
                      stroke: "#b38c00",
                      strokeWidth: 2,
                      strokeOpacity: 0.8,
                    },
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {isChartDataSuccess && chartData[0] === undefined && (
            <div className="relative flex h-fit items-center justify-center">
              <Image
                alt={token.name || token.symbol || "Token"}
                width={1000}
                height={300}
                className="w-full opacity-25"
                src={"/no-chart-custom-token.jpg"}
              />
              <p className="absolute -rotate-3 rounded-full bg-black/25 p-6 text-center text-2xl text-alert-600 shadow-2xl backdrop-blur-sm backdrop-filter">
                <span className="font-semibold italic">
                  No chart in our database. Get back in 24h.
                </span>{" "}
                😜
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HodlStats;

type PayloadProps = {
  price: number;
  date: string;
};
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as PayloadProps;

    if (!data) return null;

    return (
      <div className="rounded-lg border border-main-800 bg-main-900 p-2 shadow-sm">
        <div className="flex items-center justify-center">
          <span className="font-semibold text-dog-400">
            {currencyConverter({
              amount: data.price,
            })}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <Clock className="mr-1 h-2 w-2 text-dog-300" />
          <span className="text-xs text-dog-500">{data.date}</span>
        </div>
      </div>
    );
  }

  return null;
};
