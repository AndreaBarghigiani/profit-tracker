// Utils
import { prisma } from "@/server/db";
import { getHodl } from "@/server/api/routers/hodl";

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

      {!!hodlId && (
        <p className="mb-4 text-center text-lg text-stone-400">
          Are you buying or selling?
        </p>
      )}

      <AddHodlPositionForm hodlId={hodlId} token={token} />
    </div>
  );
};

export default AddHodlPosition;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  if (!context.params?.id) return;

  const hodl = await getHodl({
    hodlId: context.params.id,
    prisma,
  });
  const token: TokenWithoutDates = hodl.token;

  delete token.createdAt;
  delete token.updatedAt;

  return {
    props: {
      token: token,
      hodlId: context.params.id,
    },
  };
}
