// Utils
import { api } from "@/utils/api";
import { prisma } from "@/server/db";
import { getHodl } from "@/server/api/routers/hodl";
import AddHodlPositionForm from "@/components/addHodlPositionForm";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Heading from "@/components/ui/heading";

const AddHodlPosition: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tokenId, hodlId }) => {
  const {
    data: token,
    isLoading: isTokenLoading,
    isSuccess: isTokenSuccess,
  } = api.token.get.useQuery({
    tokenId,
  });

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions for {isTokenLoading ? "..." : token?.name}
      </Heading>
      <p className="text-center text-lg text-stone-400">
        Are you buying or selling?
      </p>
      {isTokenSuccess && (
        <AddHodlPositionForm type="full" hodlId={hodlId} tokenId={tokenId} />
      )}
    </div>
  );
};

export default AddHodlPosition;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  if (!context.params?.id) return;

  const hodl = await getHodl({
    hodlId: context.params.id,
    prisma,
  });

  return {
    props: {
      tokenId: hodl.tokenId,
      hodlId: context.params.id,
    },
  };
}
