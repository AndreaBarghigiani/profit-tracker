// Utils
import { useState } from "react";
import { api } from "@/utils/api";
import { uppercaseFirst } from "@/utils/string";

// Components
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  ArrowBigDownDash,
  ArrowBigRightDash,
  ArrowBigUpDash,
} from "lucide-react";

// Types
import type { NextPage } from "next";
const Transaction: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  // const {
  //   data: transactions,
  //   isLoading: isLoadingTransactions,
  //   isSuccess: isSuccessTransactions,
  // } = api.transaction.listByCurrentUser.useQuery();

  const {
    isLoading: isPaginatedLoading,
    isSuccess: isPaginatedSuccess,
    data: paginatedTransactions,
    fetchNextPage,
  } = api.transaction.listPaginatedByCurrentUser.useInfiniteQuery(
    {
      limit: 10,
      // type: TransactionType.WITHDRAW,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  console.log("paginated loading", isPaginatedLoading);

  const handleFetchNext = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handleFetchPrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const toShow = paginatedTransactions?.pages[currentPage]?.items;
  const nextCursor = paginatedTransactions?.pages[currentPage]?.nextCursor;

  return (
    <div className="space-y-4">
      <Heading size="page" gradient="gold" spacing={"massive"}>
        Transactions
      </Heading>
      <p>
        This is the list of all your transactions that happen in your portfolio.
      </p>

      {isPaginatedLoading && <p>Loading...</p>}

      <header className="flex">
        <div className="ml-auto flex items-center justify-center gap-x-2">
          <Button
            variant="outline"
            disabled={currentPage < 1}
            onClick={handleFetchPrevious}
            size="sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            disabled={!nextCursor}
            variant="outline"
            onClick={handleFetchNext}
            size="sm"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {isPaginatedSuccess ? (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 rounded-md bg-foreground/30">
            <p className="p-3">Amount</p>
            <p className="p-3">Type</p>
            <p className="p-3">Date</p>
            <p className="p-3">Project</p>
            <p className="p-3 text-center">Action</p>
          </div>
          {toShow?.map((transaction) => (
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
      ) : null}
    </div>
  );
};

export default Transaction;
