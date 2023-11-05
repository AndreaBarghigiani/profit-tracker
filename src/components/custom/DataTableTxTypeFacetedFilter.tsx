// Utils
import { cn } from "@/lib/utils";

// Types
import type { DataTableTxFilterProps } from "@/server/types";

// Components
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const DataTableTxTypeFacetedFilter = <TData, TValue>({
  column,
  title,
  options,
}: DataTableTxFilterProps<TData, TValue>) => {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2" />

              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge variant="outline" key={option.value}>
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
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
};

export default DataTableTxTypeFacetedFilter;
