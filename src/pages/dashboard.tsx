//Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import HodlCard from "@/components/ui/custom/HodlCard";
import UserStats from "@/components/ui/custom/UserStats";
import ProjectCard from "@/components/ui/custom/ProjectCard";

const Dashboard: NextPage = () => {
  api.wallet.get.useQuery();
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.getByCurrentUser.useQuery();
  const { data: hodls, isSuccess: isHodlsSuccess } =
    api.hodl.getByCurrentUser.useQuery();

  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Dashboard
      </Heading>

      <div className="grid grid-cols-5 gap-4">
        {isUserStatsSuccess && (
          <UserStats orientation="vertical" userStats={userStats} />
        )}

        <section className="col-span-4 space-y-12">
          {isProjectsSuccess ? (
            <div>
              <Heading size="h2" spacing="2xl" className="flex items-center">
                Your projects
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "ml-4 flex items-center",
                  })}
                  href="/project/add"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add project
                </Link>
              </Heading>

              <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                {projects.map((project: Project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}

          {isHodlsSuccess && (
            <div>
              <Heading size="h2" spacing="2xl" className="flex items-center">
                Your holdings
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "ml-4 flex items-center",
                  })}
                  href="/hodl/add"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add hodl
                </Link>
              </Heading>
              <div className="grid grid-cols-2 gap-4">
                {hodls.map((hodl) => (
                  <HodlCard key={hodl.id} position={hodl} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
