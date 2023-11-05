// Utils
import { transactionTypes } from "@/components/custom/Hodl/Table/columns";

// Types
import type { Table } from "@tanstack/react-table";

// Components
import Heading from "@/components/ui/heading";
import DataTableTxTypeFacetedFilter from "@/components/custom/DataTableTxTypeFacetedFilter";

const DataTableToolbar = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <div className="mb-4 flex items-center">
      <Heading as="h3" size="h3">
        Hodl transactions
      </Heading>

      <div className="ml-auto flex items-center gap-x-2">
        <p className="text-sm text-dog-500">Filters: </p>

        <DataTableTxTypeFacetedFilter
          column={table.getColumn("type")}
          title="Type"
          options={transactionTypes}
        />
      </div>
    </div>
  );
};

export default DataTableToolbar;
