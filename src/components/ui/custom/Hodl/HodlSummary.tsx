// Utils
import clsx from "clsx";
import { currencyConverter } from "@/utils/string";
import { hodlSummary } from "@/utils/positions";
import { buttonVariants } from "../../button";

// Types
import type { FullPosition } from "@/server/types";

// Components
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/heading";

const HodlSummary = ({ hodls }: { hodls: FullPosition[] }) => {
  const summary = hodlSummary(hodls);
  const topPerformer = hodls
    .filter((hodl) => hodl.token.id === summary.topPerformer.tokenId)
    .pop();

  const summaryPerformanceBadgeClass = clsx(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 ml-4 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600":
        Number(summary.topPerformer.percentage) > 0,
      "border-alert-700 bg-alert-900 text-alert-600":
        Number(summary.topPerformer.percentage) < 0,
    },
  );

  const topPerformerBadgeClass = clsx(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 ml-4 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600":
        Number(summary.topPerformer.percentage) > 0,
      "border-alert-700 bg-alert-900 text-alert-600":
        Number(summary.topPerformer.percentage) < 0,
    },
  );

  console.log("summary:", summary);
  return (
    <div className="relative rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      <Heading
        size="h2"
        spacing="small"
        className="flex justify-between text-dog-500"
      >
        Total Evaluation:
      </Heading>

      <div className="flex items-center">
        <p className="text-2xl font-semibold text-dog-200">
          {currencyConverter({ amount: summary.total })}
        </p>

        <p className={summaryPerformanceBadgeClass}>
          {summary.change.toFixed(2)}%
        </p>
      </div>

      {topPerformer && (
        <>
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
              {summary.topPerformer.percentage}%
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default HodlSummary;