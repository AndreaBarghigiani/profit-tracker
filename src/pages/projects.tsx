//Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ProjectCard from "@/components/ui/custom/ProjectCard";
import { Plus } from "lucide-react";

const Projects: NextPage = () => {
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.listByCurrentUser.useQuery();
  return (
    <>
      <Head>
        <title>Projects - Underdog Tracker</title>
      </Head>
      {isProjectsSuccess ? (
        <div className="space-y-4">
          <Heading size="page" gradient="gold" spacing={"massive"}>
            Projects
          </Heading>

          {projects.length > 0 ? (
            <>
              <header className="flex items-center">
                <Heading size="h2" spacing="2xl">
                  Your projects
                </Heading>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "ml-auto flex items-center",
                  })}
                  href="/project/create"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Project
                </Link>
              </header>

              <div className="grid grid-cols-2 gap-4">
                {projects.map((project: Project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto flex h-64 max-w-2xl flex-col items-center justify-center space-y-3 rounded-xl border border-dashed">
              <p>Looks like you don&apos;t have any projects yet.</p>
              <Link className={buttonVariants()} href="/project/create">
                Add project
              </Link>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Projects;
