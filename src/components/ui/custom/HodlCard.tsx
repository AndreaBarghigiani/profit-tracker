// Utils
// import { api } from "@/utils/api";
import clsx from "clsx";
import { currencyConverter } from "@/utils/string";

// Types
import type { Hodl, Token } from "@prisma/client";

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Eye, Wallet, Diff, Plus, Trash2, RefreshCcw } from "lucide-react";
import { Eye, Wallet, Diff, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

type HodlCardProps = Hodl & {
  token: Token;
};

const HodlCard = ({ position }: { position: HodlCardProps }) => {
  const currentEvaluation =
    position.currentAmount * parseFloat(position.token.latestPrice);
  const diffAmount = currentEvaluation - position.totalInvested;
  const isDiffPositive = diffAmount >= 0;
  const diffPerc =
    ((currentEvaluation - position.totalInvested) / position.totalInvested) *
    100;

  // Classes
  const badgeClass = clsx(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600": isDiffPositive,
      "border-alert-700 bg-alert-900 text-alert-600": !isDiffPositive,
    }
  );

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
    <div className="flex items-center rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      {!!position.token.iconUrl && (
        <Image
          src={position.token.iconUrl}
          alt={position.token.name}
          className="mr-4 flex-shrink-0 "
          width={48}
          height={48}
        />
      )}

      <div className="w-full">
        <header className="flex items-start justify-between gap-6">
          <Link
            href={`/hodl/${position.id}`}
            className={buttonVariants({
              variant: "link",
              size: "link",
            })}
          >
            <Heading size="h2" className="my-0">
              {position.token.name}
            </Heading>
          </Link>
          <p className={badgeClass}>{diffPerc.toFixed(2)}%</p>
        </header>

        <section className="mt-4 flex items-center gap-6">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-dog-800 p-2 text-dog-400">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold">
              {currencyConverter({
                amount: position.totalInvested,
              })}
            </span>
          </div>

          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
              <Diff className="h-4 w-4" />
            </div>
            <span className="text-dog-300">
              {currencyConverter({ amount: diffAmount, showSign: true })}
            </span>
          </div>

          <div className="ml-auto space-x-1 ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                    href={`/hodl/add/${position.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-dog-800 text-dog-500">
                  <p>Add transaction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/hodl/${position.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "xs",
                      className: "ml-auto",
                    })}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border-dog-800 text-dog-500">
                  <p>Check details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 
										Not show single icon button for the moment
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => deletePosition(position.id)}
                  >
                    {isDeletingPosition ? (
                      <RefreshCcw className={deleteIconClass} />
                    ) : (
                      <Trash2 className={deleteIconClass} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border-dog-800 text-dog-500">
                  <p>Delete position</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HodlCard;
