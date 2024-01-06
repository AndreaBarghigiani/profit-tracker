// Utils
import clsx from "clsx";
import {
  currencyConverter,
  formatNumber,
  uppercaseFirst,
} from "@/utils/string";
import { calcPercentageVariance } from "@/utils/number";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";
import { TransactionType } from "@prisma/client";
import { useTransactionModal } from "@/hooks/useTransactionModal";

// Types
import type { TransactionRowValues } from "@/server/types";
import type { ColumnDef } from "@tanstack/react-table";

export const transactionTypes = [
  {
    value: TransactionType.BUY,
    label: "Buy",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.BUY],
  },
  {
    value: TransactionType.SELL,
    label: "Sell",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.SELL],
  },
  {
    value: TransactionType.AIRDROP,
    label: "AirDrop",
    icon: TRANSACTION_TYPE_ICONS[TransactionType.AIRDROP],
  },
];

// Components
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTransactionModal from "@/components/custom/GeneralModal";
import EditTransactionModal from "@/components/custom/Transaction/EditModal";
import DeleteTransactionModal from "@/components/custom/Transaction/DeleteModal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<TransactionRowValues>[] = [
  {
    accessorKey: "eval",
    header: "Amount",
    cell: ({ row }) => {
      const { amount, evaluation } = row.original.eval;
      const { name } = row.original.token;

      return (
        <>
          <p className="text-base font-semibold">
            {currencyConverter({
              amount: evaluation,
            })}
          </p>
          <p className="text-xs text-dog-600">
            {formatNumber(amount, "standard")} {name}
          </p>
        </>
      );
    },
  },
  {
    accessorKey: "pnl",
    id: "pnl",
    header: "PnL",
    cell: ({ row }) => {
      const { amount, evaluation } = row.original.eval;
      const { price } = row.original.token;

      const curVsBuy = amount * price - evaluation;

      const diffClasses = clsx("text-xs", {
        "text-success-600": curVsBuy > 0,
        "text-alert-500": curVsBuy < 0,
      });

      return (
        <>
          <p>
            {currencyConverter({
              amount: amount * price,
            })}
          </p>
          <p className={diffClasses}>
            {currencyConverter({
              amount: curVsBuy,
              showSign: true,
              removeZeros: true,
            })}{" "}
            ({calcPercentageVariance(evaluation, amount * price)}
            %)
          </p>
        </>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => {
      const type = info.getValue() as TransactionType;
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
    cell: (info) => {
      const { date, time } =
        info.getValue() as TransactionRowValues["createdAt"];

      return (
        <time className="text-sm">
          <p>{date}</p>
          <p className="text-xs text-foreground/50">{time}</p>
        </time>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { original } = row;

      return <TableActionsCol row={original} />;
    },
  },
];

const TableActionsCol = ({ row }: { row: TransactionRowValues }) => {
  const transactionModal = useTransactionModal("Edit Transaction");
  const deleteModal = useTransactionModal("Delete Transaction");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="xs" variant="ghost" asChild>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>

            <TooltipContent className="border-foreground/20">
              <p className="text-dog-400">Menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-fit space-y-2 border-dog-750 bg-dog-850 px-4 py-2 text-sm text-dog-300 text-dog-400"
        sideOffset={0}
      >
        <AddTransactionModal
          size="large"
          transactionModal={transactionModal}
          customTrigger={() => (
            <Button
              variant="ghost"
              size="xs"
              className="flex w-full justify-start"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          modalContent={{
            title: "Edit your transaction",
            description: `Customize as you wish.`,
          }}
        >
          <EditTransactionModal
            transaction={row}
            setOpen={transactionModal.setOpen}
          />
        </AddTransactionModal>

        <AddTransactionModal
          size="large"
          transactionModal={deleteModal}
          customTrigger={() => (
            <Button
              variant="ghost"
              size="xs"
              className="flex w-full justify-start"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          modalContent={{
            title: "Are you sure you want to delete the transaction?",
            description: `This will remove entirely the transaction from your history.`,
          }}
        >
          <DeleteTransactionModal
            transactionId={row.id}
            setOpen={deleteModal.setOpen}
          />
        </AddTransactionModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
