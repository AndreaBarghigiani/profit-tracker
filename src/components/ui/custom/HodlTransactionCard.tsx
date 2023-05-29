// Utils
import { uppercaseFirst } from "@/utils/string";

// Types
import type { Transaction } from "@prisma/client";

// Components
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

type HodlTransactionCardProps = {
  transaction: Transaction;
};
const HodlTransactionCard = ({ transaction }: HodlTransactionCardProps) => {
  // console.log("transaction:", transaction);

  return (
    <div
      key={transaction.id}
      className="grid grid-cols-3 items-center gap-4 rounded-md bg-foreground/10"
    >
      <p className="p-3">{`$${transaction.amount.toFixed(2)}`}</p>
      <p className="flex items-center p-3">
        {transaction.type === "DEPOSIT" || transaction.type === "BUY" ? (
          <ArrowBigDownDash className="mr-2 h-4 w-4" />
        ) : (
          <ArrowBigUpDash className="mr-2 h-4 w-4" />
        )}
        {uppercaseFirst(transaction.type)}
      </p>
      <time className="ml-auto p-3 text-sm">
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
    </div>
  );
};

export default HodlTransactionCard;
