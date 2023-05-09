//Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  DepositDashboardCard,
  InterestDashboardCard,
  WithdrawDashboardCard,
} from "@/components/ui/custom/DashboardCards";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/project/${project.id}`} className={buttonVariants()}>
          View project
        </Link>
      </CardContent>
    </Card>
  );
};

const Dashboard: NextPage = () => {
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.getByCurrentUser.useQuery();

  const { data: sumTransactions, isSuccess: isSumTransactionsSuccess } =
    api.transaction.sumTransactions.useQuery();

  const mappingCards = {
    DEPOSIT: DepositDashboardCard,
    INTEREST: InterestDashboardCard,
    WITHDRAW: WithdrawDashboardCard,
  };

  const sumTransactionsCards = sumTransactions?.map((transaction) => {
    const Component = mappingCards[transaction.type];
    return <Component key={transaction.type} transaction={transaction} />;
  });

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Dashboard
      </Heading>

      {isSumTransactionsSuccess && (
        <div className="grid grid-cols-3 gap-4">
          {sumTransactionsCards?.map((card) => card)}
        </div>
      )}

      {isProjectsSuccess ? (
        <>
          <Heading size="h2" spacing="large">
            These are your projects
          </Heading>

          <div className="grid grid-cols-3 gap-4">
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
