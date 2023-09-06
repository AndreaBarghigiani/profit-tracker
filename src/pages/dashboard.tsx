//Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useRouter } from "next/router";
import { sortedPositionsByPrice } from "@/utils/positions";
import { prisma } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { getByCurrentUser } from "@/server/api/routers/hodl";
import va from "@vercel/analytics";

// Types
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import type { Project } from "@prisma/client";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import HodlCard from "@/components/custom/HodlCard";
import UserStats from "@/components/custom/UserStats";
import ProjectCard from "@/components/custom/ProjectCard";

const Dashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ hodls }) => {
  const utils = api.useContext();
  const router = useRouter();

  const { data: projects, isSuccess: isProjectsSuccess } =
    api.project.listByCurrentUser.useQuery();

  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();

  const { mutateAsync: updatePrices, isLoading: isPricesLoading } =
    api.token.updatePrices.useMutation({
      onSuccess: async () => {
        await utils.hodl.getByCurrentUser.invalidate();
        await router.replace(router.asPath);
      },
    });

  const handleRefresh = async () => {
    if (!hodls) return;

    va.track("Update Hodls Prices");
    const tokenIds = hodls.map((position) => position.token.coingecko_id);
    await updatePrices({ tokenIds });
  };

  const hodlsSorted = !!hodls && sortedPositionsByPrice(hodls);
  return (
    <>
      <Head>
        <title>Dashboard - Underdog Tracker</title>
      </Head>

      <div>
        <Heading size="page" gradient="gold" spacing="massive">
          Dashboard
        </Heading>

        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
          <section className="col-span-4 space-y-12">
            {isUserStatsSuccess && (
              <UserStats orientation="horizontal" userStats={userStats} />
            )}
            <div>
              <header className="mb-8 flex items-center">
                <Heading size="h2" spacing="none">
                  Your holdings
                </Heading>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "ml-auto flex items-center",
                  })}
                  onClick={() => va.track("Add Hodl Position")}
                  href="/hodl/add"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Hodl
                </Link>

                <Button className="ml-4" size="sm" onClick={handleRefresh}>
                  <RefreshCcw
                    className={clsx("mr-2 h-4 w-4", {
                      "animate-spin": isPricesLoading,
                    })}
                  />
                  Refresh
                </Button>
              </header>
              {!!hodlsSorted && (
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                  {hodlsSorted.map((hodl, index) => (
                    <HodlCard key={hodl.id} position={hodl} rank={index + 1} />
                  ))}
                </div>
              )}
            </div>

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
                    Project
                  </Link>
                </header>

                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                  {projects.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) return { props: {} };

  const positions = await getByCurrentUser({ ctx: { prisma, session } });

  const formattedPositions = positions.map((position) => ({
    ...position,
    createdAt: position.createdAt.toISOString(),
    updatedAt: position.updatedAt.toISOString(),
    token: {
      ...position.token,
      createdAt: position.token.createdAt.toISOString(),
      updatedAt: position.token.updatedAt.toISOString(),
      platforms: {},
    },
  }));

  // TODO: Add projects and UserStats
  return {
    props: {
      hodls: formattedPositions,
    },
  };
}
