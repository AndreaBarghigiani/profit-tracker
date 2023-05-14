import type { PrismaClient, TransactionType } from "@prisma/client";

type SumTxItem = {
  type: TransactionType;
  _sum: {
    amount: number | null;
  };
};

export type MassagedSumTxItem = {
  type: TransactionType;
  amount: number | null;
};
export const sumTransactions = async (prisma: PrismaClient, userId: string) => {
  const sumTx = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      project: {
        userId,
      },
    },
    _sum: {
      amount: true,
    },
  });

  function ensureAllTransactionTypes(sumTx: SumTxItem[]): SumTxItem[] {
    const allTypes: TransactionType[] = ["DEPOSIT", "WITHDRAW", "INTEREST"];
    const result: SumTxItem[] = allTypes.reduce(
      (acc: SumTxItem[], type: TransactionType) => {
        const existingItem = sumTx.find((item) => item.type === type);
        if (existingItem) {
          acc.push(existingItem);
        } else {
          acc.push({
            type,
            _sum: {
              amount: 0,
            },
          });
        }
        return acc;
      },
      []
    );
    return result;
  }
  const sortList = ["WITHDRAW", "DEPOSIT", "INTEREST"];
  const ordered = ensureAllTransactionTypes(sumTx).sort(
    (a, b) => sortList.indexOf(a.type) - sortList.indexOf(b.type)
  );

  const massaged: MassagedSumTxItem[] = ordered.map((item) => {
    return {
      type: item.type,
      amount: item._sum.amount,
    };
  });

  return massaged;
};
