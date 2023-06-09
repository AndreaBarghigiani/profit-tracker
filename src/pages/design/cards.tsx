// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";

// Types
import Heading from "@/components/ui/heading";
import type { NextPage } from "next";

// Components
import HodlCard from "@/components/ui/custom/HodlCard";
import ProjectCard from "@/components/ui/custom/ProjectCard";
import UserStats from "@/components/ui/custom/UserStats";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

const Cards: NextPage = () => {
  const { data: hodls, isSuccess: isHodlsSuccess } =
    api.hodl.getByCurrentUser.useQuery();
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.getByCurrentUser.useQuery();
  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();

  return (
    <>
      <div className="my-2">
        <Heading>Summary Card</Heading>
        {isUserStatsSuccess && (
          <UserStats orientation="vertical" userStats={userStats} />
        )}
      </div>

      <div className="my-2">
        <Heading>Project Card</Heading>
        {isProjectsSuccess && (
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <div className="my-2">
        <Heading>Hodl Card</Heading>
        {isHodlsSuccess && (
          <div className="grid grid-cols-2 gap-4">
            {hodls.map((hodl) => (
              <HodlCard key={hodl.id} position={hodl} />
            ))}
          </div>
        )}
      </div>

      <div className="my-2">
        <Heading>Top Gainer/Loser Card</Heading>
      </div>
    </>
  );
};

export default Cards;
