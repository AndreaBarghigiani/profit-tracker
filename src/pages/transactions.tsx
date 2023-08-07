// Utils
import { useState } from "react";
import { api } from "@/utils/api";
import { uppercaseFirst, currencyConverter } from "@/utils/string";

// Components
import Head from "next/head";
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
import { Skeleton } from "@/components/ui/skeleton";

// Types
import type { NextPage } from "next";
const Transaction: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const {
    isLoading: isPaginatedLoading,
    data: paginatedTransactions,
    fetchNextPage,
  } = api.transaction.listPaginatedByCurrentUser.useInfiniteQuery(
    {
      limit: 10,
      // type: TransactionType.WITHDRAW,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

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
    <>
      <Head>
        <title>Transactions - Underdog Tracker</title>
      </Head>

      <div className="space-y-4">
        <Heading size="page" gradient="gold" spacing={"massive"}>
          Transactions
        </Heading>
        <p>
          This is the list of all your transactions that happen in your
          portfolio.
        </p>

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

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 rounded-md bg-foreground/30">
            <p className="p-3">Amount</p>
            <p className="p-3">Type</p>
            <p className="p-3">Date</p>
            <p className="p-3">Source</p>
            <p className="p-3 text-center">Action</p>
          </div>
          {isPaginatedLoading
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 items-center gap-4 rounded-md bg-foreground/10"
                >
                  <div className="m-3 space-y-3">
                    <Skeleton
                      as="p"
                      className=" h-[20px] w-[200px] bg-foreground/50"
                    />
                    <Skeleton
                      as="p"
                      className=" h-3 w-[200px] bg-foreground/70"
                    />
                  </div>
                  <Skeleton className="m-3 h-[20px] w-[200px] bg-foreground/50" />
                  <div className="m-3 space-y-3">
                    <Skeleton
                      as="p"
                      className=" h-[20px] w-[200px] bg-foreground/50"
                    />
                    <Skeleton
                      as="p"
                      className=" h-3 w-[200px] bg-foreground/70"
                    />
                  </div>
                  <Skeleton className="m-3 h-[20px] w-[150px] bg-foreground/50" />
                  <Skeleton className="m-3 h-[20px] w-[100px] bg-foreground/50 text-center" />
                </div>
              ))
            : toShow?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-5 items-center gap-4 rounded-md bg-foreground/10"
                >
                  <div className="p-3">
                    {!!transaction.project && (
                      <p>{currencyConverter({ amount: transaction.amount })}</p>
                    )}
                    {!!transaction.hodl && (
                      <p>
                        {currencyConverter({ amount: transaction.evaluation })}
                      </p>
                    )}

                    <p className="text-xs text-foreground/50">
                      {transaction.hodl
                        ? transaction.amount.toString() +
                          " " +
                          transaction.hodl.token.symbol.toUpperCase()
                        : null}
                    </p>
                  </div>
                  <p className="flex items-center p-3">
                    {transaction.type === "DEPOSIT" ||
                    transaction.type === "BUY" ? (
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
                  {!!transaction.project && (
                    <>
                      <div className=" p-3">
                        <p className="truncate">{transaction.project.name}</p>
                        <p className="text-xs text-foreground/50">Project</p>
                      </div>

                      <Link
                        href={`/project/${transaction.project.id}`}
                        className={buttonVariants({ variant: "link" })}
                      >
                        Check out investment
                        <ArrowBigRightDash className="ml-2 h-4 w-4" />
                      </Link>
                    </>
                  )}

                  {!!transaction.hodl && (
                    <>
                      <div className="p-3">
                        <p>{transaction.hodl.token.name}</p>
                        <p className="text-xs text-foreground/50">HODL</p>
                      </div>

                      <Link
                        href={`/hodl/${transaction.hodl.id}`}
                        className={buttonVariants({ variant: "link" })}
                      >
                        Check out investment
                        <ArrowBigRightDash className="ml-2 h-4 w-4" />
                      </Link>
                    </>
                  )}
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Transaction;
