// Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import PositionCard from "@/components/ui/custom/PositionCard";
import HodlCard from "@/components/ui/custom/HodlCard";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Hodl: NextPage = () => {
  const { data: positions, isSuccess: isPositionsSuccess } =
    api.hodl.getByCurrentUser.useQuery();

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions
      </Heading>

      {!!positions && (
        <div className="my-4 space-y-3 text-center text-stone-400">
          <Link
            className={buttonVariants({ className: "ml-auto" })}
            href="/hodl/add"
          >
            New position
          </Link>
          <p className=" text-lg ">
            Here you go, track and compare your positions.
          </p>
        </div>
      )}

      {!positions && (
        <div className="space-y-3 text-center text-stone-400">
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

      {isPositionsSuccess && (
        <div className="grid grid-cols-2 gap-4">
          {positions.map((position) => (
            <HodlCard key={position.id} position={position} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hodl;
