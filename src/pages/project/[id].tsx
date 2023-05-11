// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { uppercaseFirst } from "@/utils/string";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const formatDate = Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const { data: project, isLoading } = api.project.get.useQuery(
    { projectId: router.query.id as string },
    { enabled: !!router.query.id }
  );

  if (!project) return <div>Project not found</div>;

  const { data: lastTx, isSuccess: isSuccessLastTransaction } =
    api.transaction.lastTransaction.useQuery(
      { projectId: project.id, projectAccruing: project.accruing },
      { enabled: !!project }
    );

  const { data: transactions, isLoading: isLoadingTransactions } =
    api.transaction.list.useQuery(
      {
        projectId: router.query.id as string,
        orderBy: "desc",
      },
      { enabled: !!router.query.id }
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          {project.name}
        </Heading>
        <p>{project.description}</p>
      </header>
      <article className="space-y-3">
        <header className="flex items-center">
          <Heading as="h2" size="h2">
            Project Details
          </Heading>
          <div className="ml-auto text-right text-sm">
            <p>Created at: {formatDate.format(project.createdAt)}</p>
          </div>
        </header>

        <div className="flex flex-wrap justify-between gap-3 pb-8">
          {project.currentHolding ? (
            <Card>
              <CardHeader>
                <CardTitle>Current Holding</CardTitle>
                <CardDescription>
                  ${project.currentHolding.toFixed(2)}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Increase Frequency</CardTitle>
              <CardDescription>
                {uppercaseFirst(project.increaseFrequency)}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Increase Amount</CardTitle>
              <CardDescription>{project.increaseAmount}%</CardDescription>
            </CardHeader>
          </Card>

          {isSuccessLastTransaction ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Last Transaction
                  <time
                    className="text-xs"
                    dateTime={lastTx?.createdAt.toString()}
                  >
                    {formatDate.format(lastTx?.createdAt)}
                  </time>
                </CardTitle>
                <CardDescription className="flex justify-between">
                  Type: {lastTx ? uppercaseFirst(lastTx?.type) : "unknown"}
                  <time
                    className="text-xs"
                    dateTime={formatDate.format(new Date())}
                  >
                    Current: {formatDate.format(new Date())}
                  </time>
                </CardDescription>
              </CardHeader>
              <CardContent>
                Amount: <strong>${lastTx?.amount}</strong>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="flex">
          <Heading as="h3" size="h3">
            Project transactions
          </Heading>
          <div className="ml-auto flex gap-2">
            <Link
              className={buttonVariants()}
              href={`/transaction/add?projectId=${project.id}`}
            >
              Add Transaction
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 rounded-md bg-foreground/30">
            <p className="p-3">Amount</p>
            <p className="p-3">Type</p>
            <p className="p-3">Date</p>
          </div>
          {isLoadingTransactions
            ? "Loading..."
            : transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-3 items-center gap-4 rounded-md bg-foreground/10"
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
                </div>
              ))}
        </div>
      </article>
    </div>
  );
};

export default ProjectPage;
