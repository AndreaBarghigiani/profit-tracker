// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { uppercaseFirst } from "@/utils/string";

// Types
import type { NextPageWithLayout } from "../_app";

// Components
import LayoutDashboard from "@/components/layoutDashboard";
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

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const formatDate = Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const { data: project, isLoading } = api.project.get.useQuery(
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
          <p className="ml-auto">{formatDate.format(project.createdAt)}</p>
        </header>
        <div className="flex justify-between gap-3 pb-8">
          {project.currentHolding ? (
            <Card>
              <CardHeader>
                <CardTitle>Current Holding</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ${project.currentHolding.toFixed(2)}
                </CardDescription>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Increase Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {uppercaseFirst(project.increaseFrequency)}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Increase Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.increaseAmount}%</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex">
          <h3 className="text-lg font-semibold">Project transactions</h3>
          <div className="ml-auto flex gap-2">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/transaction/new?projectId=${project.id}`}
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

ProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default ProjectPage;
