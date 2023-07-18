// Utils
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { currencyConverter, formatNumber } from "@/utils/string";
import { useHodlTransactionModal } from "@/hooks/useTransactionModal";

// Types
import type { Hodl, Token } from "@prisma/client";
import type { LucideIcon } from "lucide-react";

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Eye, Wallet, Diff, Plus, Trash2, RefreshCcw } from "lucide-react";
import { Eye, Wallet, Plus, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import AddTransactionModal from "./AddTransactionModal";
import AddHodlPositionForm from "./AddHodlPositionForm";

type HodlCardProps = Hodl & {
  token: Token;
};

const HodlCard = ({
  position,
  rank,
}: {
  position: HodlCardProps;
  rank: number;
}) => {
  const transactionModal = useHodlTransactionModal();
  const currentEvaluation = position.amount * position.token.latestPrice;
  const { data: hodlDiff, isSuccess: isHodlDiffSuccess } =
    api.hodl.getDiffFromBuyes.useQuery(
      {
        hodlId: position.id,
        hodlAmount: position.amount,
        tokenLatestPrice: position.token.latestPrice,
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  // Classes
  const badgeClass = clsx(
    "flex flex-shrink-0 items-center font-semibold rounded-3xl border px-3 py-1 text-xs",
    {
      "border-success-800 bg-success-900 text-success-600": hodlDiff?.positive,
      "border-alert-700 bg-alert-900 text-alert-600": !hodlDiff?.positive,
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
    <div className="relative flex items-center rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      {rank && (
        <div className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg bg-dog-800 px-3 py-1 text-xs text-dog-500">
          {`#${rank}`}
        </div>
      )}
      {!!position.token.iconUrl && (
        <Image
          src={position.token.iconUrl}
          alt={position.token.name}
          className="mr-4 flex-shrink-0 rounded-full"
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
          {isHodlDiffSuccess && (
            <p className={badgeClass}>{hodlDiff.percentage}%</p>
          )}
        </header>

        <section className="mt-4 flex items-center gap-6">
          <HodlCardData amount={currentEvaluation} Icon={Wallet} highlighted>
            <p className="text-base font-semibold">Evaluation</p>
            <p className="mt-1 text-xs text-dog-600">
              Token amount:{` `}
              <strong>
                {formatNumber(position.amount)}{" "}
                <span className="uppercase">{position.token.symbol}</span>
              </strong>
            </p>
          </HodlCardData>

          <HodlCardData amount={position.exposure} Icon={AlertTriangle}>
            <p className="text-base font-semibold">Exposure</p>
          </HodlCardData>

          {/* <div className="flex items-center">
            <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
              <Diff className="h-4 w-4" />
            </div>
            <span className="text-dog-300">
              {currencyConverter({ amount: diffAmount, showSign: true })}
            </span>
          </div> */}

          <div className="ml-auto space-x-2">
            <AddTransactionModal
              size="large"
              Icon={Plus}
              iconClasses="h-4 w-4"
              transactionModal={transactionModal}
              btnVariants={{
                variant: "ghost",
                size: "xs",
                corners: "pill",
              }}
            >
              <AddHodlPositionForm
                hodlId={position.id}
                token={position.token}
                closeModal={() => transactionModal.setOpen(false)}
              />
            </AddTransactionModal>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/hodl/${position.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "xs",
                      corners: "pill",
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
  const divIconClasses = cn(
    "mr-2 rounded-full bg-dog-800 text-dog-400 flex items-center justify-center",
    {
      "p-2": highlighted,
      "p-1": !highlighted,
    }
  );

  const iconClasses = cn({
    "h-6 w-6": highlighted,
    "h-4 w-4": !highlighted,
  });

  const textClasses = cn({
    "text-4xl font-semibold": highlighted,
    "text-dog-300": !highlighted,
  });
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <div className={divIconClasses}>
              <Icon className={iconClasses} />
            </div>
            <span className={textClasses}>
              {currencyConverter({ amount: amount })}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-dog-800 text-center text-dog-500"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
