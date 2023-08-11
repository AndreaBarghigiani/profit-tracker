// Utils
import { useState } from "react";
import { currencyConverter, formatNumber } from "@/utils/string";

// Types
import type { FullPosition } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";

const massageData = (positions: FullPosition[]) => {
  const data = positions.reduce(
    (acc, position) => ({
      ...acc,
      [position.token.symbol]: position.amount * position.token.latestPrice,
    }),
    {},
  );

  return [data];
};

const barColors = ["#ffcd1a", "#e6b400", "#b38c00", "#806400", "#4d3c00"];

const HodlBar = ({ hodls }: { hodls: FullPosition[] }) => {
  const data = massageData(hodls);
  const tokens = hodls.map((hodl) => hodl.token.symbol).slice(0, 5);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  const hoveredTokenInfo = (token: string) => {
    const tokenInfo = hodls.filter((hodl) => hodl.token.symbol === token).pop();
    if (!tokenInfo) return null;

    return (
      <>
        {tokenInfo.token.symbol.toUpperCase()}:{" "}
        <span className="text-md text-dog-400">
          {formatNumber(tokenInfo.amount)} ={" "}
          {currencyConverter({
            amount: tokenInfo.amount * tokenInfo.token.latestPrice,
          })}
        </span>
      </>
    );
  };

  return (
    <div className="relative rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      <Heading size="h2">Your top 5 bags</Heading>

      <p className="font-semibold text-dog-300">
        {hoveredToken
          ? hoveredTokenInfo(hoveredToken)
          : tokens.map((token) => token.toUpperCase()).join(", ")}
      </p>

      <div className="h-24 w-full">
        <ResponsiveContainer width="100%">
          <BarChart className="mx-auto" layout="vertical" data={data}>
            <XAxis type="number" hide={true} />
            <YAxis type="category" dataKey="name" hide={true} />

            {tokens.map((token, index) => (
              <Bar
                key={token}
                dataKey={token}
                fill={barColors[index]}
                stackId="holding"
                className="cursor-pointer"
                onMouseOver={() => {
                  setHoveredToken(token);
                }}
                onMouseOut={() => {
                  setHoveredToken(null);
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HodlBar;
