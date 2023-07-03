// Utils
import { prisma } from "@/server/db";
import { getToken } from "@/server/api/routers/token";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import type { TokenWithoutDates } from "@/server/types";

// Components
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";
import Heading from "@/components/ui/heading";

const AddHodlPosition: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ token, hodlId }) => {
  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions for {token.name}
      </Heading>
      <p className="mb-4 text-center text-lg text-stone-400">
        Are you buying or selling?
      </p>

      <div className="mx-auto w-2/3">
        <AddHodlPositionForm hodlId={hodlId} token={token} />
      </div>
    </div>
  );
};

export default AddHodlPosition;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ coingecko_id: string }>
) {
  if (!context.params?.coingecko_id) return;

  const token: TokenWithoutDates = await getToken({
    tokenId: context.params?.coingecko_id,
    prisma,
  });

  delete token.createdAt;
  delete token.updatedAt;

  return {
    props: {
      token: token,
      hodlId: null,
    },
  };
}
