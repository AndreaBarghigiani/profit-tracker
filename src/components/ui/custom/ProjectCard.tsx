// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";

// Types
import type { Project } from "@prisma/client";

// Components
import { Skeleton } from "@/components/ui/skeleton";
import Heading from "@/components/ui/heading";
import { TimerReset, PiggyBank, Eye, BarChart, Gem } from "lucide-react";
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

      <section className="mt-4 flex items-center gap-6">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-dog-800 p-2 text-dog-400">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <span className="text-4xl font-semibold">
                  {currencyConverter({ amount: project.exposure })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-dog-800 text-center text-dog-500"
            >
              <p className="text-base font-semibold">Exposure</p>
              <p className="mt-1 text-xs text-dog-600">
                Deposited:{` `}
                <strong>
                  {currencyConverter({ amount: project.deposit })}
                </strong>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
                  <BarChart className="h-4 w-4" />
                </div>
                <span className="text-dog-300">
                  {currencyConverter({ amount: project.interest })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-dog-800 text-center text-dog-500"
            >
              <p className="text-base font-semibold">Available interest</p>
              {isInterestSuccess && (
                <p className="mt-1 text-xs text-dog-600">
                  All Time:{` `}
                  <strong>
                    {currencyConverter({ amount: interests?.evaluation })}
                  </strong>
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
                  <Gem className="h-4 w-4" />
                </div>
                <span className="text-dog-300">
                  {currencyConverter({ amount: project.profits })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-dog-800 text-dog-500"
            >
              <p className="text-base font-semibold">Profits</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
