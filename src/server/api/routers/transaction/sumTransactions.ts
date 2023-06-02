import type { PrismaClient, TransactionType } from "@prisma/client";
import type {
  SumTxItem,
  MassagedSumTxItem,
  SumTxItemValued,
} from "@/server/types";

export function ensureAllTransactionTypes(
  sumTx: SumTxItem[]
): SumTxItemValued[] {
  const allTypes: TransactionType[] = ["DEPOSIT", "WITHDRAW", "INTEREST"];

  const result: SumTxItemValued[] = allTypes.reduce(
    (acc: SumTxItemValued[], type: TransactionType) => {
      const existingItem = sumTx.find((item) => item.type === type);
      if (existingItem) {
        const amount = existingItem._sum.amount ? existingItem._sum.amount : 0;
        acc.push({
          type: existingItem.type,
          _sum: {
            amount,
          },
        });
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

export const sumTransactions = async (prisma: PrismaClient, userId: string) => {
  const sumTx = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      OR: [
        {
          project: {
            userId,
          },
        },
        {
          hodl: {
            userId,
          },
        },
      ],
    },
    _sum: {
      amount: true,
    },
  });

  const sortList = ["WITHDRAW", "DEPOSIT", "INTEREST", "BUY", "SELL"];
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
