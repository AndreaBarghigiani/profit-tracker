// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { sortedPositionsByPrice } from "@/utils/positions";
import { prisma } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { getByCurrentUser } from "@/server/api/routers/hodl";
import va from "@vercel/analytics";
import { useRouter } from "next/router";

// Types
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

// Components
import { Button, buttonVariants } from "@/components/ui/button";
import { RefreshCcw, Plus } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import HodlCard from "@/components/custom/HodlCard";
import HodlBar from "@/components/custom/HodlBar";
import HodlSummary from "@/components/custom/Hodl/HodlSummary";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ positions }) => {
  const utils = api.useContext();
  const router = useRouter();

  const { mutateAsync: updatePrices, isLoading: isPricesLoading } =
    api.token.updatePrices.useMutation({
      onSuccess: async () => {
        await utils.hodl.getByCurrentUser.invalidate();
        await refreshPage();
      },
    });

  const positionsSorted = !!positions ? sortedPositionsByPrice(positions) : [];

  const refreshPage = async () => {
    await router.replace(router.asPath, undefined, { scroll: false });
  };

  const handleRefresh = async () => {
    if (!positions) return;

    const tokenIds = positions.map((position) => position.token.coingecko_id);
    await updatePrices({ tokenIds });
  };

  return (
    <>
      <Head>
        <title>Hodls - Underdog Tracker</title>
      </Head>

      <div>
        <Heading size="page" gradient="gold" spacing="massive">
          Your Positions
        </Heading>

        {!!positions && positions.length ? (
          <div className="my-4 space-y-3 text-center text-stone-400">
            <Heading>Congrats for tracking your positions!</Heading>
          </div>
        ) : (
          <div className="my-4 space-y-3 text-center text-stone-400">
            <Heading>Looks like you have no positions open, yet!</Heading>
            <p>Just click the button below and start track your investments.</p>
            <Link
              className={buttonVariants({ className: "ml-auto" })}
              href="/hodl/add"
            >
              Create one
            </Link>
          </div>
        )}

        {!!positionsSorted.length && (
          <>
            <header className="mb-8 flex items-center">
              <Heading>Hodl at a glance:</Heading>
              <Link
                className={buttonVariants({
                  size: "sm",
                  className: "ml-auto flex items-center",
                })}
                onClick={() => va.track("Add Hodl Position")}
                href="/hodl/add"
              >
                <Plus className="mr-1 h-3 w-3" />
                Hodl
              </Link>
            </header>
            <div className="mb-4 xl:grid xl:grid-cols-2 xl:gap-4">
              <HodlSummary className="mb-4 xl:mb-0" hodls={positionsSorted} />
              <HodlBar hodls={positionsSorted} />
            </div>

            <header className="flex">
              <Heading>Hodl Positions:</Heading>
              <Button className="ml-auto" size="sm" onClick={handleRefresh}>
                <RefreshCcw
                  className={clsx("mr-2 h-4 w-4", {
                    "animate-spin": isPricesLoading,
                  })}
                />
                Refresh
              </Button>
            </header>
            <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
              {positionsSorted.map((position, index) => (
                <HodlCard
                  key={position.id}
                  position={position}
                  rank={index + 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Hodl;

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

  return {
    props: {
      positions: formattedPositions,
    },
  };
}
