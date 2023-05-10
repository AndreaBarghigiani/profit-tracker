// Utils
import { api } from "@/utils/api";
import { uppercaseFirst } from "@/utils/string";

// Components
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowBigRightDash,
  ArrowBigDownDash,
  ArrowBigUpDash,
} from "lucide-react";

// Types
import type { NextPage } from "next";
const Transaction: NextPage = () => {
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isSuccess: isSuccessTransactions,
  } = api.transaction.listByCurrentUser.useQuery();

  return (
    <div className="space-y-4">
      <Heading size="page" gradient="gold" spacing={"massive"}>
        Transactions
      </Heading>
      <p>
        This is the list of all your transactions that happen in your portfolio.
      </p>
      {isLoadingTransactions && <p>Loading...</p>}

      {isSuccessTransactions && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 rounded-md bg-foreground/30">
            <p className="p-3">Amount</p>
            <p className="p-3">Type</p>
            <p className="p-3">Date</p>
            <p className="p-3">Project</p>
            <p className="p-3 text-center">Action</p>
          </div>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-5 items-center gap-4 rounded-md bg-foreground/10"
            >
              <p className="p-3">{`$${transaction.amount.toFixed(2)}`}</p>
              <p className="flex items-center p-3">
                {transaction.type === "DEPOSIT" ? (
                  <ArrowBigDownDash className="mr-2 h-4 w-4" />
                ) : (
                  <ArrowBigUpDash className="mr-2 h-4 w-4" />
                )}
                {uppercaseFirst(transaction.type)}
              </p>
              <time className="p-3 text-sm">
                <p>
                  {transaction.createdAt.toLocaleString("en-US", {
                    dateStyle: "medium",
                  })}
                </p>
                <p className="text-xs text-foreground/50">
                  {transaction.createdAt.toLocaleString("en-US", {
                    timeStyle: "short",
                  })}
                </p>
              </time>
              <p className="p-3">{transaction.project.name}</p>

              <Link
                href={`/project/${transaction.project.id}`}
                className={buttonVariants({ variant: "link" })}
              >
                Check out project
                <ArrowBigRightDash className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transaction;
