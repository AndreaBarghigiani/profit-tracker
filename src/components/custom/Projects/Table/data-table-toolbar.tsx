// Utils
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { transactionTypes } from "@/components/custom/Projects/Table/columns";

// Types
import type { Project } from "@prisma/client";
import type { Table, Column } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  project: Project;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
// Components
import { Plus, Check } from "lucide-react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import AddProjectTransactionForm from "@/components/custom/AddProjectTransactionForm";
import OnlyAdmin from "@/components/custom/OnlyAdmin";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// const DataTable = <TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) => {
// const DataTableToolbar = <TData>({
// 	table,
// }: DataTableToolbarProps<TData>) {

// }

const DataTableToolbar = <TData,>({
  table,
  project,
}: DataTableToolbarProps<TData>) => {
  const utils = api.useContext();

  const { mutate: addInterest } = api.transaction.addInterest.useMutation({
    onSuccess: async () => {
      await utils.wallet.getUserStats.invalidate();
      await utils.project.get.invalidate();
      await utils.transaction.list.invalidate();
    },
  });

  const handleAddInterest = () => {
    if (!project) return;

    addInterest({ projectId: project.id, skip: true });
  };

  return (
    <div className="mb-4 flex items-center">
      <Heading as="h3" size="h3">
        Project transactions
      </Heading>

      <div className="ml-auto flex gap-2">
        <OnlyAdmin>
          <Button variant="adminOutline" onClick={handleAddInterest}>
            <Plus className="mr-2 h-3 w-3" />
            Interest
          </Button>
        </OnlyAdmin>

        <AddTransaction project={project} />

        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={transactionTypes}
          />
        )}
      </div>
    </div>
  );
};

export default DataTableToolbar;

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  console.log("facets:", facets);
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  console.log("selectedValues:", selectedValues);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{title}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] border-dog-600 p-0" align="end">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);

          return (
            <div
              key={option.value}
              className="flex cursor-pointer items-center px-4 py-2 text-sm text-dog-300 hover:bg-dog-600 hover:text-dog-100"
              onClick={() => {
                if (isSelected) {
                  selectedValues.delete(option.value);
                } else {
                  selectedValues.add(option.value);
                }
                const filterValues = Array.from(selectedValues);
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined,
                );
              }}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border border-dog-600",
                  !isSelected && "[&_svg]:invisible",
                )}
              >
                <Check className="h-4 w-4 text-main-500" />
              </div>

              <div className="ml-4 flex flex-shrink-0 items-center ">
                {option.icon && <option.icon className="mr-2 h-4 w-4" />}

                <span>{option.label}</span>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

const AddTransaction = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonVariants()}>
          <Plus className="mr-2 h-3 w-3" />
          Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
          <DialogDescription>
            Here you can add your transaction.
          </DialogDescription>
        </DialogHeader>

        <AddProjectTransactionForm project={project} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
