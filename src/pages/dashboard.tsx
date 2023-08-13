//Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { sortedPositionsByPrice } from "@/utils/positions";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import HodlCard from "@/components/ui/custom/HodlCard";
import UserStats from "@/components/ui/custom/UserStats";
import ProjectCard from "@/components/ui/custom/ProjectCard";

const Dashboard: NextPage = () => {
  const utils = api.useContext();

  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.listByCurrentUser.useQuery();
  const { data: hodls, isSuccess: isHodlsSuccess } =
    api.hodl.getByCurrentUser.useQuery();

  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();

  const { mutateAsync: updatePrices, isLoading: isPricesLoading } =
    api.token.updatePrices.useMutation({
      onSuccess: async () => {
        await utils.hodl.getByCurrentUser.invalidate();
      },
    });

  const handleRefresh = async () => {
    if (!hodls) return;

    const tokenIds = hodls.map((position) => position.token.coingecko_id);
    const updates = await updatePrices({ tokenIds });
    console.log("updates:", updates);
  };

  const hodlsSorted = isHodlsSuccess && sortedPositionsByPrice(hodls);
  return (
    <>
      <Head>
        <title>Dashboard - Underdog Tracker</title>
      </Head>

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
                    Add project
                  </Link>
                </header>

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
                <header className="flex items-center">
                  <Heading size="h2" spacing="2xl">
                    Your holdings
                  </Heading>
                  <Link
                    className={buttonVariants({
                      size: "sm",
                      className: "ml-auto flex items-center",
                    })}
                    href="/hodl/add"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add hodl
                  </Link>

                  <Button className="ml-4" size="sm" onClick={handleRefresh}>
                    <RefreshCcw
                      className={clsx("mr-2 h-4 w-4", {
                        "animate-spin": isPricesLoading,
                      })}
                    />
                    Refresh all
                  </Button>
                </header>
                {!!hodlsSorted && (
                  <div className="grid grid-cols-2 gap-4">
                    {hodlsSorted.map((hodl, index) => (
                      <HodlCard
                        key={hodl.id}
                        position={hodl}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
