// Utils
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { api } from "@/utils/api";
import clsx from "clsx";

// Types
import type { Token } from "@prisma/client";
import type { HodlDeleteTransaction } from "@/server/types";

// Components
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

type HodlTransactionCardProps = {
  transaction: HodlDeleteTransaction;
  token: Partial<Token>;
  refresher: () => void;
};

const HodlTransactionCard = ({
  transaction,
  token,
  refresher,
}: HodlTransactionCardProps) => {
  const utils = api.useContext();
  const { mutate: deleteTransaction, isLoading: isDeletingTransaction } =
    api.hodl.deleteTransaction.useMutation({
      onSuccess: async () => {
        await utils.wallet.getUserStats.invalidate();
        await utils.hodl.getTransactions.invalidate();
        await utils.hodl.getDiffFromBuyes.invalidate();
        refresher();
      },
    });

  const iconClass = clsx("h-4 w-4", {
    "animate-spin": isDeletingTransaction,
  });

  return (
    <div
      key={transaction.id}
      className="grid grid-cols-4 items-center gap-4 rounded-md bg-foreground/10"
    >
      <div className="p-3">
        <p>
          {currencyConverter({
            amount: transaction?.evaluation
              ? transaction.evaluation
              : transaction.amount,
          })}
        </p>
        <p className="text-xs text-foreground/50">
          {transaction.amount} {!!token.symbol && uppercaseFirst(token.symbol)}
        </p>
      </div>
      <p className="flex items-center p-3">
        {transaction.type === "DEPOSIT" || transaction.type === "BUY" ? (
          <ArrowBigDownDash className="mr-2 h-4 w-4" />
        ) : (
          <ArrowBigUpDash className="mr-2 h-4 w-4" />
        )}
        {uppercaseFirst(transaction.type)}
      </p>
      <time className="p-3 text-sm">
        <p>
          {transaction.createdAt.toLocaleString("en-US", {
            dateStyle: "medium",
          })}
        </p>
        <p className="text-xs text-foreground/50">
          {transaction.createdAt.toLocaleString("en-US", {
            timeStyle: "short",
          })}
        </p>
      </time>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto mr-3"
              onClick={() =>
                deleteTransaction({
                  hodlId: transaction.hodlId,
                  transactionId: transaction.id,
                  transactionAmount: transaction.amount,
                  transactionEvaluation: transaction.evaluation,
                })
              }
            >
              {isDeletingTransaction ? (
                <RefreshCcw className={iconClass} />
              ) : (
                <Trash2 className={iconClass} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border-foreground/20">
            <p>Delete transaction</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default HodlTransactionCard;
