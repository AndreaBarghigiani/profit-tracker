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
import { InterestDashboardCard } from "@/components/ui/custom/DashboardCards";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: result } = api.wallet.getDailyPassiveResult.useQuery();

  const {
    data: allInterests,
    isLoading: isAllInterestsLoading,
    isSuccess: isAllInterestsSuccess,
  } = api.transaction.sumInterests.useQuery();

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Dashboard
      </Heading>

      {isAllInterestsLoading ? (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <Skeleton as="p" className="h-4 w-24 bg-foreground/70" />
              <Skeleton as="h3" className="h-5 w-32 bg-foreground/50" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton as="p" className="h-4 w-24 bg-foreground/70" />
              <Skeleton as="h3" className="h-5 w-32 bg-foreground/50" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton as="p" className="h-4 w-24 bg-foreground/70" />
              <Skeleton as="h3" className="h-5 w-32 bg-foreground/50" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton as="p" className="h-4 w-24 bg-foreground/70" />
              <Skeleton as="h3" className="h-5 w-32 bg-foreground/50" />
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Target</CardDescription>
              <CardTitle>{result}</CardTitle>
            </CardHeader>
          </Card>
          {isAllInterestsSuccess && (
            <InterestDashboardCard transaction={allInterests} />
          )}
          {/* {sumTransactionsCards?.map((card) => card)} */}
        </div>
      )}

      {isProjectsSuccess ? (
        <>
          <Heading size="h2" spacing="large" className="flex justify-center">
            These are your projects
            <Link
              className={buttonVariants({ className: "ml-auto" })}
              href="/project/add"
            >
              Add project
            </Link>
          </Heading>

          <div className="grid grid-cols-2 gap-4">
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
