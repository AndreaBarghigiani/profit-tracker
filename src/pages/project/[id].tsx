// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { uppercaseFirst, formatDate } from "@/utils/string";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import { ArrowBigDownDash, ArrowBigUpDash, Check, X } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import LastProjectTransaction from "@/components/ui/custom/LastProjectTransaction";

const ProjectPage: NextPage = () => {
  const router = useRouter();

  const { data: project, isLoading } = api.project.get.useQuery(
    { projectId: router.query.id as string },
    { enabled: !!router.query.id }
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

  if (!project) return <div>Project not found</div>;

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

          <Card>
            <CardHeader>
              <CardTitle>Compounds?</CardTitle>
              <CardDescription>
                {project.compound ? (
                  <Check className="text-green-600" />
                ) : (
                  <X className="text-red-500" />
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          <LastProjectTransaction project={project} />
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
