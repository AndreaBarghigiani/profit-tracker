//Utils
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
  const {
    data: projects,
    isLoading: isProjectsLoading,
    isSuccess: isProjectsSuccess,
  } = api.project.list.useQuery();
  const wallet = api.wallet.get.useQuery();

  return (
    <div>
      <h2 className="text-xl font-semibold">These are your Holding</h2>
      <Card>
        <CardHeader>
          <CardDescription>Current Holding</CardDescription>
          <CardTitle>${wallet.data?.total.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      {isProjectsSuccess ? (
        <>
          <h2 className="text-xl font-semibold">These are your projects</h2>

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
