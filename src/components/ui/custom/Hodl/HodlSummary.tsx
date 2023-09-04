// Utils
import { cn } from "@/lib/utils";
import { currencyConverter } from "@/utils/string";
import { calcPercentageVariance } from "@/utils/number";
import { hodlSummary } from "@/utils/positions";
import { buttonVariants } from "../../button";

// Types
import type { FullPositionZod } from "@/server/types";

// Components
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/heading";

const HodlSummary = ({
  hodls,
  className,
}: {
  hodls: FullPositionZod[];
  className?: string;
}) => {
  const summary = hodlSummary(hodls);
  const topPerformer = hodls
    .filter((hodl) => hodl.token.id === summary.topPerformer.tokenId)
    .pop();

  const summaryPerformanceBadgeClass = cn(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 ml-10 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600":
        Number(summary.change) > 0,
      "border-alert-700 bg-alert-900 text-alert-600":
        Number(summary.change) < 0,
    },
  );

  const topPerformerBadgeClass = cn(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 ml-4 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600":
        Number(summary.topPerformer.percentage) > 0,
      "border-alert-700 bg-alert-900 text-alert-600":
        Number(summary.topPerformer.percentage) < 0,
    },
  );

  return (
    <div
      className={cn(
        "relative flex gap-x-10 gap-y-2 rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg xl:flex-col",
        className,
      )}
    >
      <div>
        <Heading
          size="h2"
          spacing="small"
          className="flex justify-between text-dog-500"
        >
          Total Valuation:
        </Heading>

        <div className="mb-4 flex items-center">
          <div>
            <p className="text-2xl font-semibold text-dog-200">
              {currencyConverter({ amount: summary.total })}
            </p>
            <p className="text-sm font-normal text-dog-600">
              {currencyConverter({ amount: summary.change, showSign: true })}
            </p>
          </div>

          <p className={summaryPerformanceBadgeClass}>
            {calcPercentageVariance(
              summary.total,
              summary.total + summary.change,
            )}
            %
          </p>
        </div>
      </div>

      {topPerformer && (
        <div>
          <Heading
            size="h2"
            spacing="small"
            className="flex justify-between text-dog-500"
          >
            Top Performer:
          </Heading>

          <div className="flex items-center">
            <Image
              src={topPerformer.token.iconUrl ?? "/placeholder.png"}
              alt={topPerformer.token.name}
              className="mr-2 flex-shrink-0 rounded-full"
              width={22}
              height={22}
            />

            <Link
              href={`/hodl/${topPerformer.id}`}
              className={buttonVariants({
                variant: "link",
                size: "link",
              })}
            >
              <Heading size="h3" className="my-0">
                {topPerformer.token.name}
              </Heading>
            </Link>

            <p className={topPerformerBadgeClass}>
              {summary.topPerformer.percentage.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HodlSummary;
