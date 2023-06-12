// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";

// Types
import type { Project } from "@prisma/client";

// Components
import { Skeleton } from "@/components/ui/skeleton";
import Heading from "@/components/ui/heading";
import { TimerReset, PiggyBank, Eye, BarChart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const ProjectCard = ({ project }: { project: Project }) => {
  const {
    data: interests,
    isLoading: isInterestLoading,
    isError: isInterestError,
    // error: interestError,
  } = api.transaction.projectInterest.useQuery({
    projectId: project.id,
  });

  if (isInterestLoading)
    return (
      <div className="rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
        <header className="flex items-start justify-between gap-6">
          <Skeleton as="h2" className="h-5 w-32 bg-dog-400" />
          <Skeleton as="div" className="h-5 w-4 bg-dog-400" />
        </header>

        <section className="mt-4 flex items-center gap-6">
          <div className="flex items-center">
            <Skeleton as="div" className="mr-2 h-6 w-6 bg-dog-500" />
            <Skeleton as="span" className="h-6 w-20 bg-dog-500" />
          </div>

          <div className="flex items-center">
            <Skeleton as="div" className="mr-2 h-4 w-4 bg-dog-500" />
            <Skeleton as="span" className="h-4 w-12 bg-dog-500" />
          </div>

          <Skeleton as="a" className="ml-auto h-4 w-6 bg-dog-500" />
        </section>
      </div>
    );

  if (isInterestError) return <div>Error</div>;

  return (
    <div className="rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg">
      <header className="flex items-start justify-between gap-6">
        <Heading size="h2" className="my-0">
          {project.name}
        </Heading>
        <div className="flex flex-shrink-0 items-center rounded-3xl border border-dog-800 px-3 py-1 text-xs text-dog-600">
          <div className="mr-2 text-dog-600">
            <TimerReset className="h-4 w-4" />
          </div>
          {project.increaseAmount}% {project.increaseFrequency}
        </div>
      </header>

      <section className="mt-4 flex items-center gap-6">
        <div className="flex items-center">
          <div className="mr-2 rounded-full bg-dog-800 p-2 text-dog-400">
            <PiggyBank className="h-6 w-6" />
          </div>
          <span className="text-4xl font-semibold">
            {currencyConverter({ amount: project.currentHolding })}
          </span>
        </div>

        <div className="flex items-center">
          <div className="mr-2 rounded-full bg-dog-800 p-1 text-dog-400">
            <BarChart className="h-4 w-4" />
          </div>
          <span className="text-dog-300">
            {currencyConverter({ amount: interests.amount })}
          </span>
        </div>

        <Link
          href={`/project/${project.id}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "ml-auto",
          })}
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Link>
      </section>
    </div>
  );
};

export default ProjectCard;
