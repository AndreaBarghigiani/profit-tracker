// Utils
import { useState, cloneElement, isValidElement } from "react";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { currencyConverter, formatNumber } from "@/utils/string";
import { useRouter } from "next/router";

// Types
import type { LucideIcon } from "lucide-react";
import type { FullPositionZod } from "@/server/types";
import type { MouseEvent, ReactElement } from "react";
import type { ClassValue } from "clsx";

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Wallet, DoorOpen } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

const HodlCard = ({
  position,
  rank,
}: {
  position: FullPositionZod;
  rank: number;
}) => {
  const currentEvaluation = position.amount * position.token.latestPrice;
  const router = useRouter();
  const { data: hodlDiff, isSuccess: isHodlDiffSuccess } =
    api.hodl.getDiffFromBuyes.useQuery(
      {
        hodlId: position.id,
        hodlAmount: position.amount,
        tokenLatestPrice: position.token.latestPrice,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  // Classes
  const badgeClass = clsx(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600": hodlDiff?.positive,
      "border-alert-700 bg-alert-900 text-alert-600": !hodlDiff?.positive,
    },
  );

  const handleCardClick = async () => {
    if (!!position.id) {
      await router.push(`/hodl/${position.id}`);
    }
  };

  // Keeping for now, in case I want to add delete functionality
  // const utils = api.useContext();
  // const { mutate: deletePosition, isLoading: isDeletingPosition } =
  //   api.hodl.delete.useMutation({
  //     onSuccess: async () => {
  //       await utils.wallet.get.invalidate();
  //       await utils.hodl.getByCurrentUser.invalidate();
  //     },
  //   });
  // const deleteIconClass = clsx("h-4 w-4", {
  //   "animate-spin": isDeletingPosition,
  // });

  return (
    <div
      className="group relative rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg transition-colors hover:cursor-pointer hover:bg-dog-800"
      onClick={handleCardClick}
    >
      {rank && (
        <div className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg bg-dog-800 px-3 py-1 text-xs text-dog-500">
          {`#${rank}`}
        </div>
      )}
      <div className="flex items-center">
        <Image
          src={position.token.iconUrl ?? "/placeholder.png"}
          alt={position.token.name}
          className="mr-4 flex-shrink-0 rounded-full"
          width={48}
          height={48}
        />

        <div className="w-full grow-0">
          <header className="flex items-start justify-between gap-6">
            <Link
              href={`/hodl/${position.id}`}
              className={buttonVariants({
                variant: "link",
                size: "link",
                className: "hover:no-underline group-hover:text-main-600",
              })}
            >
              <Heading size="h2" className="my-0">
                {position.token.name}
              </Heading>
            </Link>
            {isHodlDiffSuccess && (
              <p className={badgeClass}>{hodlDiff.percentage.toFixed(2)}%</p>
            )}
          </header>

          <section className="mt-4 flex items-center justify-between">
            <HodlCardData
              key="token-amount"
              amount={currentEvaluation}
              Icon={Wallet}
              highlighted
            >
              <p className="text-base font-semibold">Details</p>

              <p className="mt-1 hidden text-xs text-dog-600">
                Valuation:{` `}
                <strong>
                  {currencyConverter({ amount: currentEvaluation })}
                </strong>
              </p>

              <p className="mt-1 text-xs text-dog-600">
                Token amount:{` `}
                <strong>
                  {formatNumber(position.amount)}{" "}
                  <span className="uppercase">{position.token.symbol}</span>
                </strong>
              </p>
            </HodlCardData>

            <HodlCardData
              key="exposure"
              amount={position.exposure}
              Icon={DoorOpen}
            >
              <p className="text-base font-semibold">Exposure</p>
              <p className="text-xs">
                How much to <strong>100% ROI</strong>
              </p>
            </HodlCardData>

            {/* <div className="flex items-center">
            <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
              <Diff className="h-4 w-4" />
            </div>
            <span className="text-dog-300">
              {currencyConverter({ amount: diffAmount, showSign: true })}
            </span>
          </div> */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HodlCard;

// Made in order to solve some issues with `cloneElement`
type ChildrenProps = {
  className?: string;
};

const HodlCardData = ({
  amount,
  Icon,
  children,
  highlighted = false,
}: {
  amount: number;
  Icon: LucideIcon;
  children: React.ReactNode;
  highlighted?: boolean;
}) => {
  const triggerClasses = cn("flex items-center min-w-0", {
    "max-w-[50%]": highlighted,
    "max-w-[40%]": !highlighted,
  });

  const divIconClasses = cn(
    "mr-2 rounded-full bg-dog-800 text-dog-400 flex items-center justify-center",
    {
      "p-2": highlighted,
      "p-1": !highlighted,
    },
  );

  const iconClasses = cn({
    "h-6 w-6": highlighted,
    "h-4 w-4": !highlighted,
  });

  const textClasses = cn("truncate", {
    "text-4xl font-semibold": highlighted,
    "text-dog-500": !highlighted,
  });

  // Calculate Text Overflow
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleOverflow = ({ currentTarget }: MouseEvent<Element>) => {
    const { scrollWidth, clientWidth } = currentTarget;
    setIsOverflowing(scrollWidth > clientWidth);
  };

  const massagedChildren = Array.isArray(children)
    ? children.map((child: ReactElement<ChildrenProps>, index) => {
        if (!isValidElement(child)) return child;

        return cloneElement(child as ReactElement, {
          className: cn(child.props.className as ClassValue, {
            block: isOverflowing,
          }),
          key: `key-${index}`,
        });
      })
    : children;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={triggerClasses}>
            <div className={divIconClasses}>
              <Icon className={iconClasses} />
            </div>
            <span className={textClasses} onMouseEnter={handleOverflow}>
              {currencyConverter({ amount: amount })}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs border-dog-800 text-center text-dog-500 "
        >
          {massagedChildren}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
