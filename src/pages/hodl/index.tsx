// Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import PositionCard from "@/components/ui/custom/PositionCard";

const Hodl: NextPage = () => {
  const {
    data: positions,
    isLoading: isPositionsLoading,
    isSuccess: isPositionsSuccess,
  } = api.hodl.list.useQuery();

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions
      </Heading>
      <p className="text-center text-lg text-stone-400">
        In here I cal list all my Hodl positions.
      </p>

      {isPositionsSuccess ? (
        <div className="space-y-3">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Hodl;
