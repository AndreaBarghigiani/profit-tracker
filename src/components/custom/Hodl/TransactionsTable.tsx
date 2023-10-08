// Utils
import { parseTransactionRowData } from "@/utils/positions";

// Types
import type {
  HodlDeleteTransaction,
  TokenWithoutDatesZod,
} from "@/server/types";

// Components
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransactionRow from "@/components/custom/Hodl/TransactionRow";

const HodlTransactionsTable = ({
  transactions,
  token,
}: {
  transactions: HodlDeleteTransaction[];
  token: TokenWithoutDatesZod;
}) => {
  const tableData = parseTransactionRowData(transactions, token);

  if (tableData.length === 0) return <p className="p-3">No transactions</p>;
  return (
    <div className="overflow-hidden rounded-md border border-dog-600">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>PnL</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((rowData) => (
            <TransactionRow key={rowData.id} rowData={rowData} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HodlTransactionsTable;
