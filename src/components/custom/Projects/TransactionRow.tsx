// Utils
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";

// Types
import type { Transaction } from "@prisma/client";

// Components
import { TableRow, TableCell } from "@/components/ui/table";

type ProjectTransactionCardProps = {
  transaction: Transaction;
};

const ProjectTransactionCard = ({
  transaction,
}: ProjectTransactionCardProps) => {
  const Icon = TRANSACTION_TYPE_ICONS[transaction.type];

  return (
    <TableRow key={transaction.id}>
      <TableCell>
        <p>{currencyConverter({ amount: transaction.amount })}</p>
      </TableCell>

      <TableCell>
        <p className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {uppercaseFirst(transaction.type)}
        </p>
      </TableCell>

      <TableCell>
        <time className="text-sm">
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
      </TableCell>
    </TableRow>
  );
};

export default ProjectTransactionCard;
