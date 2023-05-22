// Utils
import { uppercaseFirst, currencyConverter } from "@/utils/string";

// Types
import type { MassagedSumTxItem } from "@/server/types";

// Components
import {
  Card,
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
        <CardTitle>{currencyConverter(transaction.amount)}</CardTitle>
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
        <CardTitle>{currencyConverter(transaction.amount)}</CardTitle>
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
        <CardTitle>{currencyConverter(transaction.amount)}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export { DepositDashboardCard, InterestDashboardCard, WithdrawDashboardCard };
