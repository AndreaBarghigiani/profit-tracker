// Utils
import { api } from "@/utils/api";

// Types
import Heading from "@/components/ui/heading";
import type { NextPage } from "next";

// Components
import HodlCard from "@/components/ui/custom/HodlCard";
import ProjectCard from "@/components/ui/custom/ProjectCard";

const Cards: NextPage = () => {
  const { data: hodls, isSuccess: isHodlsSuccess } =
    api.hodl.getByCurrentUser.useQuery();
  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.getByCurrentUser.useQuery();
  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();
  console.log("userStats:", userStats);

  return (
    <>
      <div className="my-2">
        <Heading>Summary Card</Heading>
        <div className="grid grid-cols-4 rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
          <div>
            <Heading size="h3">Money at Work</Heading>
          </div>
          <div>
            <Heading size="h3">Profits</Heading>
          </div>
          <div>
            <Heading size="h3">Interests</Heading>
          </div>
          <div>
            <Heading size="h3">Daily Target</Heading>
          </div>
        </div>
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
