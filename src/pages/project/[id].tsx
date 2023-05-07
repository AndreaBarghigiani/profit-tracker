// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { uppercaseFirst } from "@/utils/string";

// Types
import { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

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

  const { data: lastTx, isSuccess: isSuccessLastTransaction } =
    api.transaction.lastTransaction.useQuery(
      { projectId: router.query.id as string },
      { enabled: !!router.query.id }
    );

  const { mutate: testInterest } = api.transaction.addInterest.useMutation();

  const { data: transactions, isLoading: isLoadingTransactions } =
    api.transaction.list.useQuery(
      { projectId: router.query.id as string },
      { enabled: !!router.query.id }
    );

  if (isLoading) return <div>Loading...</div>;

  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex max-w-3xl flex-col space-y-4">
      <header>
        <Link className={`mb-4 ${buttonVariants()}`} href={`/dashboard`}>
          <ArrowBigLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <Heading>{project.name}</Heading>
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
                <CardTitle>
                  <div className="flex justify-between">
                    Last Transaction
                    <time
                      className="text-xs"
                      dateTime={lastTx?.createdAt.toString()}
                    >
                      {formatDate.format(lastTx?.createdAt)}
                    </time>
                  </div>
                </CardTitle>
                <CardDescription>
                  <div className="flex justify-between">
                    Type: {lastTx ? uppercaseFirst(lastTx?.type) : "unknown"}
                    <time
                      className="text-xs"
                      dateTime={formatDate.format(new Date())}
                    >
                      Current: {formatDate.format(new Date())}
                    </time>
                  </div>
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
              className={buttonVariants({ variant: "secondary" })}
              href={`/transaction/add?projectId=${project.id}`}
            >
              Add Transaction
            </Link>
            <Button onClick={() => testInterest({ projectId: project.id })}>
              Test Interest
            </Button>
          </div>
        </div>

        <table className="min-w-full">
          <thead className="text-left">
            <tr>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingTransactions
              ? "Loading..."
              : transactions?.map((transaction) => (
                  <tr key={transaction.id} className="border-b-2 p-1">
                    <td>${transaction.amount}</td>
                    <td>{uppercaseFirst(transaction.type)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </article>
    </div>
  );
};

export default ProjectPage;
