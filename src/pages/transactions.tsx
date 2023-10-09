// Utils
import { useState } from "react";
import { api } from "@/utils/api";
import * as z from "zod";
import {
  uppercaseFirst,
  currencyConverter,
  formatNumber,
} from "@/utils/string";
import { TRANSACTION_TYPE_ICONS } from "@/utils/positions";

// Types
import type { NextPage } from "next";
import { TransactionType } from "@prisma/client";
const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  evaluation: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  createdAt: z.date(),
  project: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  hodl: z
    .object({
      id: z.string(),
      token: z.object({
        name: z.string(),
        symbol: z.string(),
      }),
    })
    .nullable(),
});
type TransactionSchemaType = z.infer<typeof TransactionSchema>;

const TransactionTableSchema = z.array(TransactionSchema).optional();
type TransactionTableSchemaType = z.infer<typeof TransactionTableSchema>;

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ArrowBigRightDash } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const Transaction: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const {
    isLoading: isPaginatedLoading,
    data: paginatedTransactions,
    isFetching: isPaginatedFetching,
    fetchNextPage,
  } = api.transaction.listPaginatedByCurrentUser.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const handleFetchNext = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handleFetchPrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const toShow = paginatedTransactions?.pages[currentPage]
    ?.items as TransactionTableSchemaType;
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

        <div className="overflow-hidden rounded-md border border-dog-600">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[240px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPaginatedLoading || isPaginatedFetching
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  [...Array(10)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton
                          as="p"
                          className="mb-2 h-[20px] w-[200px] bg-foreground/50"
                        />
                        <Skeleton
                          as="p"
                          className="h-3 w-[200px] bg-foreground/70"
                        />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="m-3 h-[20px] w-[200px] bg-foreground/50" />
                      </TableCell>

                      <TableCell>
                        <Skeleton
                          as="p"
                          className="mb-2 h-[20px] w-[200px] bg-foreground/50"
                        />
                        <Skeleton
                          as="p"
                          className="h-3 w-[150px] bg-foreground/70"
                        />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="m-3 h-[20px] w-[150px] bg-foreground/50" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="m-3 h-[20px] w-[100px] bg-foreground/50 text-center" />
                      </TableCell>
                    </TableRow>
                  ))
                : toShow?.map((transaction: TransactionSchemaType) => (
                    <TransactionTableRow
                      key={transaction.id}
                      rowData={transaction}
                    />
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Transaction;

const TransactionTableRow = ({
  rowData,
}: {
  rowData: TransactionSchemaType;
}) => {
  const Icon = TRANSACTION_TYPE_ICONS[rowData.type];

  let transactionLink = "#";

  if (rowData.project) {
    transactionLink = `/project/${rowData.project.id}`;
  } else if (rowData.hodl) {
    transactionLink = `/hodl/${rowData.hodl.id}`;
  }

  return (
    <TableRow key={rowData.id} className="items-center">
      <TableCell>
        {!!rowData.project && (
          <p>{currencyConverter({ amount: rowData.amount })}</p>
        )}
        {!!rowData.hodl && (
          <>
            <p>{currencyConverter({ amount: rowData.evaluation })}</p>
            <p className="text-xs text-foreground/50">
              {formatNumber(rowData.amount, "standard")}{" "}
              {rowData.hodl.token.name}
            </p>
          </>
        )}
      </TableCell>

      <TableCell>
        <p className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {uppercaseFirst(rowData.type)}
        </p>
      </TableCell>

      <TableCell>
        {/* Date */}
        <time className="text-sm">
          <p>
            {rowData.createdAt.toLocaleString("en-US", {
              dateStyle: "medium",
            })}
          </p>
          <p className="text-xs text-foreground/50">
            {rowData.createdAt.toLocaleString("en-US", {
              timeStyle: "short",
            })}
          </p>
        </time>
      </TableCell>

      <TableCell>
        {!!rowData.project && (
          <>
            <p className="truncate">{rowData.project.name}</p>
            <p className="text-xs text-foreground/50">Project</p>
          </>
        )}
        {!!rowData.hodl && (
          <>
            <p>{rowData.hodl.token.name}</p>
            <p className="text-xs text-foreground/50">HODL</p>
          </>
        )}
      </TableCell>

      <TableCell>
        <Link
          href={transactionLink}
          className={buttonVariants({ variant: "link", size: "xs" })}
        >
          Check out investment
          <ArrowBigRightDash className="ml-2 h-4 w-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
};
