// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { sortedPositionsByPrice } from "@/utils/positions";
import { prisma } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { getByCurrentUser } from "@/server/api/routers/hodl";

// Types
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

// Components
import { Button, buttonVariants } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import HodlCard from "@/components/ui/custom/HodlCard";
import HodlBar from "@/components/ui/custom/HodlBar";
import HodlSummary from "@/components/ui/custom/Hodl/HodlSummary";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ positions }) => {
  const utils = api.useContext();

  const { mutateAsync: updatePrices, isLoading: isPricesLoading } =
    api.token.updatePrices.useMutation({
      onSuccess: async () => {
        await utils.hodl.getByCurrentUser.invalidate();
      },
    });

  const positionsSorted = !!positions ? sortedPositionsByPrice(positions) : [];

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
          Your positions
        </Heading>

        <div className="my-4 space-y-3 text-center text-stone-400">
          {/* {isPositionLoading && (
            <>
              <Skeleton as="h1" className="mx-auto h-10 w-64 bg-dog-400" />
              <Skeleton as="p" className="mx-auto h-6 w-144 bg-dog-400 " />
              <Skeleton as="a" className="mx-auto block h-8 w-32 bg-dog-400" />
            </>
          )} */}

          {!!positions && positions.length ? (
            <>
              <Heading>Congrats for tracking your positions!</Heading>
              <p className=" text-lg ">
                Here you can have a feeling on how your investments are going,
                or create a new one.
              </p>
              <Link
                className={buttonVariants({ className: "ml-auto" })}
                href="/hodl/add"
              >
                New position
              </Link>
            </>
          ) : (
            <>
              <Heading>Looks like you have no positions open, yet!</Heading>
              <p>
                Just click the button below and start track your investments.
              </p>
              <Link
                className={buttonVariants({ className: "ml-auto" })}
                href="/hodl/add"
              >
                Create one
              </Link>
            </>
          )}
        </div>

        {!!positionsSorted && (
          <>
            <Heading>Hodl at a glance:</Heading>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <HodlSummary hodls={positionsSorted} />
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
                Refresh all
              </Button>
            </header>
            <div className="grid grid-cols-2 gap-4">
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
  console.log("session from hodl Page:", session);
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
