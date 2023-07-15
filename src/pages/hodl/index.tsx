// Utils
import { api } from "@/utils/api";
import { sortedPositions } from "@/utils/positions";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import HodlCard from "@/components/ui/custom/HodlCard";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const Hodl: NextPage = () => {
  const {
    data: positions,
    isSuccess: isPositionsSuccess,
    isLoading: isPositionLoading,
  } = api.hodl.getByCurrentUser.useQuery();

  const positionsSorted = isPositionsSuccess && sortedPositions(positions);

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions
      </Heading>

      <div className="my-4 space-y-3 text-center text-stone-400">
        {isPositionLoading && (
          <>
            <Skeleton as="h1" className="mx-auto h-10 w-64 bg-dog-400" />
            <Skeleton as="p" className="mx-auto h-6 w-144 bg-dog-400 " />
            <Skeleton as="a" className="mx-auto block h-8 w-32 bg-dog-400" />
          </>
        )}

        {isPositionsSuccess && positions.length ? (
          <>
            <Heading>Congrats for tracking your positions!</Heading>
            <p className=" text-lg ">
              Here you can have a feeling on how your investments are going, or
              create a new one.
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
            <p>Just click the button below and start track your investments.</p>
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
        <div className="grid grid-cols-2 gap-4">
          {positionsSorted.map((position, index) => (
            <HodlCard key={position.id} position={position} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hodl;
