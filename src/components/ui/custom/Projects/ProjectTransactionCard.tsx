// Utils
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";

// Types
import type { Transaction } from "@prisma/client";

type ProjectTransactionCardProps = {
  transaction: Transaction;
};

const ProjectTransactionCard = ({
  transaction,
}: ProjectTransactionCardProps) => {
  const Icon = TRANSACTION_TYPE_ICONS[transaction.type];

  return (
    <div
      key={transaction.id}
      className="grid grid-cols-3 items-center gap-4 rounded-md bg-foreground/10"
    >
      <p className="p-3">{currencyConverter({ amount: transaction.amount })}</p>
      <p className="flex items-center p-3">
        <Icon className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default ProjectTransactionCard;
