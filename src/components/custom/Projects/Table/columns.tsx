// Utils
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";
import { TransactionType } from "@prisma/client";

// Types
import type { Transaction } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

export const transactionTypes = [
  {
    value: TransactionType.DEPOSIT,
    label: "Deposit",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.DEPOSIT],
  },
  {
    value: TransactionType.INTEREST,
    label: "Interest",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.INTEREST],
  },
  {
    value: TransactionType.WITHDRAW,
    label: "Withdraw",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.WITHDRAW],
  },
];

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount: Transaction["amount"] = row.getValue("amount");

      return currencyConverter({ amount });
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: Transaction["type"] = row.getValue("type");
      const Icon = TRANSACTION_TYPE_ICONS[type];

      return (
        <p className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {uppercaseFirst(type)}
        </p>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return value.includes(row.getValue(id)) as boolean;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const createdAt: Transaction["createdAt"] = row.getValue("createdAt");
      return (
        <>
          <p>
            {createdAt.toLocaleString("en-US", {
              dateStyle: "medium",
            })}
          </p>
          <p className="text-xs text-foreground/50">
            {createdAt.toLocaleString("en-US", {
              timeStyle: "short",
            })}
          </p>
        </>
      );
    },
  },
];
