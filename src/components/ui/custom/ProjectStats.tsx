// Utils
import { currencyConverter } from "@/utils/string";
import clsx from "clsx";

// Types
import type { Project } from "@prisma/client";
import type { ReactElement } from "react";

// Components
import Heading from "@/components/ui/heading";
import { AlertTriangle, Glasses, Percent, CalendarRange } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ProjectStatsCardProps = {
  project: Project;
};

const ProjectStats = ({ project }: ProjectStatsCardProps) => {
  const wrapperClasses = clsx(
    "flex justify-around rounded-lg border border-dog-800 bg-dog-900 p-5 shadow-lg"
  );

  const separatorOrientation = "vertical";

  return (
    <div className={wrapperClasses}>
      <div>
        <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
            General exposures
          </Heading>
        </header>

        <section>
          <Heading size="h4" className="flex items-center text-dog-500">
            Exposure
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: project.exposure })}
          </p>

          <Separator
            orientation="horizontal"
            decorative
            className="mt-2 bg-dog-600"
          />

          {project.compound ? (
            <>
              <Heading size="h4" className="flex items-center text-dog-500">
                Money At Work
              </Heading>
              <p className="text-3xl font-semibold">
                {currencyConverter({ amount: project.moneyAtWork })}
              </p>
            </>
          ) : (
            <>
              <Heading size="h4" className="flex items-center text-dog-500">
                Deposits
                <span className="ml-2 text-xs font-light text-dog-400">
                  {/* (Unlocks in 7 days) */}
                </span>
              </Heading>
              <p className="text-3xl font-semibold">
                {currencyConverter({ amount: project.deposit })}
              </p>
            </>
          )}

          {/* Hide behind "Show more" 
          <Separator
            orientation="horizontal"
            decorative
            className=" mt-2 bg-dog-600"
          />

          <Heading size="h4" className="flex items-center text-dog-500">
            Deposits
            <span className="ml-2 text-xs font-light text-dog-400">
              {/* (Unlocks in 7 days) 
            </span>
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: project.deposit })}
					</p>
					*/}
        </section>
      </div>

      <Separator
        orientation={separatorOrientation}
        decorative
        className="h-48 bg-dog-600"
      />

      <div>
        <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
            General exposures
          </Heading>
        </header>

        <section>
          <Heading size="h4" className="flex items-center text-dog-500">
            Available Interests
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: project.interest })}
          </p>

          <Separator
            orientation="horizontal"
            decorative
            className="mt-2 bg-dog-600"
          />

          <Heading size="h4" className="flex items-center text-dog-500">
            Profit
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: project.profits })}
          </p>

          {/* Hide behind "Show more" 
          <Separator
            orientation="horizontal"
            decorative
            className="mt-2 bg-dog-600"
          />

          <Heading size="h4" className="flex items-center text-dog-500">
            Total Interests
          </Heading>
          <p className="text-3xl font-semibold">
            {currencyConverter({ amount: 150 })}
            <span className="ml-2 text-xs font-light text-dog-400">fixed</span>
					</p>
					*/}
        </section>
      </div>

      <Separator
        orientation={separatorOrientation}
        decorative
        className="h-48 bg-dog-600"
      />

      <div>
        <header>
          <Heading size="h2" className="mt-0 flex items-center text-dog-400">
            <Glasses className="mr-2 h-4 w-4 flex-shrink-0" />
            Project details
          </Heading>
        </header>

        <section>
          <Heading size="h4" className="flex items-center text-dog-500">
            Frequency {project.compound ? "(Compound)" : ""}
          </Heading>
          <p className="text-3xl font-semibold">
            {project.increaseAmount}% {project.increaseFrequency}
          </p>

          <Separator
            orientation="horizontal"
            decorative
            className="mt-2 bg-dog-600"
          />
        </section>
      </div>
    </div>
  );
};

const ProjectStatsCol = ({
  title,
  value,
  leftIcon,
  rightIcon,
}: {
  title: string;
  value: number;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}) => {
  return (
    <div>
      <header>
        <Heading size="h3" className="mt-0 flex items-center text-dog-500">
          {!!rightIcon && rightIcon}
          {title}
          {!!leftIcon && leftIcon}
        </Heading>
      </header>

      <section>
        <p className="text-3xl font-semibold">
          {currencyConverter({ amount: value })}
        </p>
      </section>
    </div>
  );
};

export default ProjectStats;
