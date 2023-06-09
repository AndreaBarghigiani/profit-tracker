//Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ProjectCard from "@/components/ui/custom/ProjectCard";

const Projects: NextPage = () => {
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.getByCurrentUser.useQuery();
  return (
    <>
      {isProjectsSuccess ? (
        <div className="space-y-4">
          <Heading size="page" gradient="gold" spacing={"massive"}>
            Projects
          </Heading>

          <p className="flex items-center">
            These are your projects
            <Link
              className={buttonVariants({ className: "ml-auto" })}
              href="/project/add"
            >
              Add project
            </Link>
          </p>

          <div className="grid grid-cols-2 gap-4">
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Projects;
