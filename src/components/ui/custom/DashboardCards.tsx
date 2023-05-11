// Utils
import { uppercaseFirst } from "@/utils/string";

// Types
import type { MassagedSumTxItem } from "@/server/api/routers/transaction/sumTransactions";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DepositDashboardCard = ({
  transaction,
}: {
  transaction: MassagedSumTxItem;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{uppercaseFirst(transaction.type)}</CardDescription>
        <CardTitle>${transaction.amount}</CardTitle>
      </CardHeader>
    </Card>
  );
};

const InterestDashboardCard = ({
  transaction,
}: {
  transaction: MassagedSumTxItem;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{uppercaseFirst(transaction.type)}</CardDescription>
        <CardTitle>${transaction.amount}</CardTitle>
      </CardHeader>
    </Card>
  );
};

const WithdrawDashboardCard = ({
  transaction,
}: {
  transaction: MassagedSumTxItem;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{uppercaseFirst(transaction.type)}</CardDescription>
        <CardTitle>${transaction.amount}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export { DepositDashboardCard, InterestDashboardCard, WithdrawDashboardCard };
