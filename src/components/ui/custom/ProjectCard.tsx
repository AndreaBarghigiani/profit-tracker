// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";

import { cn } from "@/lib/utils";

// Types
import type { Project } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import {
  TimerReset,
  PiggyBank,
  Eye,
  BarChart,
  Gem,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

const ProjectCard = ({ project }: { project: Project }) => {
  const {
    data: interests,
    isLoading: isInterestLoading,
    isSuccess: isInterestSuccess,
    isError: isInterestError,
    // error: interestError,
  } = api.transaction.projectInterest.useQuery({
    projectId: project.id,
  });

  // ProjectData, what changes
  // icon, size,

  return (
    <div className="rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      <header className="flex items-start justify-between gap-6">
        <Link
          href={`/project/${project.id}`}
          className={buttonVariants({
            variant: "link",
            size: "link",
          })}
        >
          <Heading size="h2" className="my-0">
            {project.name}
          </Heading>
        </Link>
        <div className="flex flex-shrink-0 items-center rounded-3xl border border-dog-800 px-3 py-1 text-xs text-dog-600">
          <div className="mr-2 text-dog-600">
            <TimerReset className="h-4 w-4" />
          </div>
          {project.increaseAmount}% {project.increaseFrequency}
        </div>
      </header>

      <section className="mt-4 flex items-end gap-6">
        {/* When exposure goes to 0, switch it with profits  */}
        <ProjectCardData amount={project.exposure} highlighted Icon={PiggyBank}>
          <p className="text-base font-semibold">Exposure</p>
          <p className="mt-1 text-xs text-dog-600">
            {project.compound ? (
              <>
                Money At Work:{` `}
                <strong>
                  {currencyConverter({ amount: project.moneyAtWork })}
                </strong>
              </>
            ) : (
              <>
                Deposited:{` `}
                <strong>
                  {currencyConverter({ amount: project.deposit })}
                </strong>
              </>
            )}
          </p>
        </ProjectCardData>

        <ProjectCardData amount={project.interest} Icon={BarChart}>
          <p className="text-base font-semibold">Available interest</p>
          {isInterestSuccess && (
            <p className="mt-1 text-xs text-dog-600">
              All Time:{` `}
              <strong>
                {currencyConverter({ amount: interests?.evaluation })}
              </strong>
            </p>
          )}
        </ProjectCardData>

        <ProjectCardData amount={project.profits} Icon={Gem}>
          <p className="text-base font-semibold">Profits</p>
        </ProjectCardData>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${project.id}`}
                className={buttonVariants({
                  variant: "ghost",
                  size: "xs",
                  className: "ml-auto",
                })}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="border-dog-800 text-dog-500">
              <p>Project details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
    </div>
  );
};

export default ProjectCard;

const ProjectCardData = ({
  amount,
  Icon,
  children,
  highlighted = false,
}: {
  amount: number;
  Icon: LucideIcon;
  children: React.ReactNode;
  highlighted?: boolean;
}) => {
  const divIconClasses = cn("mr-2 rounded-full bg-dog-800 text-dog-400", {
    "p-2": highlighted,
    "p-1": !highlighted,
  });

  const iconClasses = cn({
    "h-6 w-6": highlighted,
    "h-4 w-4": !highlighted,
  });

  const textClasses = cn({
    "text-4xl font-semibold": highlighted,
    "text-dog-300": !highlighted,
  });
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <div className={divIconClasses}>
              <Icon className={iconClasses} />
            </div>
            <span className={textClasses}>
              {currencyConverter({ amount: amount })}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-dog-800 text-center text-dog-500"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
