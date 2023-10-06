// Utils
import clsx from "clsx";
import {
  currencyConverter,
  uppercaseFirst,
  formatNumber,
} from "@/utils/string";
import { calcPercentageVariance } from "@/utils/number";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";
import { useTransactionModal } from "@/hooks/useTransactionModal";

// Types
import type { TransactionRowValues } from "@/server/types";

// Components
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const TransactionRow = ({ rowData }: { rowData: TransactionRowValues }) => {
  const transactionModal = useTransactionModal("Edit Transaction");
  const deleteModal = useTransactionModal("Delete Transaction");

  const Icon = TRANSACTION_TYPE_ICONS[rowData.type];

  const curVsBuy =
    rowData.eval.amount * rowData.token.price - rowData.eval.evaluation;

  const diffClasses = clsx("text-xs", {
    "text-success-600": curVsBuy > 0,
    "text-alert-500": curVsBuy < 0,
  });

  return (
    <TableRow key={rowData.id} className="items-center">
      <TableCell>
        <p className="text-base font-semibold">
          {currencyConverter({
            amount: rowData.eval.evaluation,
          })}
        </p>
        <p className="text-xs text-dog-600">
          {formatNumber(rowData.eval.amount, "standard")} {rowData.token.name}
        </p>
      </TableCell>

      <TableCell>
        <p>
          {currencyConverter({
            amount: rowData.eval.amount * rowData.token.price,
          })}
        </p>

        <p className={diffClasses}>
          {currencyConverter({
            amount: curVsBuy,
            showSign: true,
            removeZeros: true,
          })}{" "}
          (
          {calcPercentageVariance(
            rowData.eval.evaluation,
            rowData.eval.amount * rowData.token.price,
          )}
          %)
        </p>
      </TableCell>

      <TableCell>
        <p className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {uppercaseFirst(rowData.type)}
        </p>
      </TableCell>

      <TableCell>
        <time className="text-sm">
          <p>{rowData.createdAt.date}</p>
          <p className="text-xs text-foreground/50">{rowData.createdAt.time}</p>
        </time>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="xs" variant="ghost">
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
            className="w-fit space-y-2 border-dog-750 px-4 py-2 text-sm text-dog-300"
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
                transaction={rowData}
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
                transactionId={rowData.id}
                setOpen={deleteModal.setOpen}
              />
            </AddTransactionModal>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
