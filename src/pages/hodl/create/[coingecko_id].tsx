// Utils
import { prisma } from "@/server/db";
import { getToken } from "@/server/api/routers/token";
import { getHodlByTokenId } from "@/server/api/routers/hodl";
import { getServerAuthSession } from "@/server/auth";

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
> = ({ token, hodlId, hodlAmount }) => {
  const positionFormHodl = { hodlId, hodlAmount };
  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions for {token.name}
      </Heading>

      {/* JUST A TEST TO SHOW CONTRACTS
			{!!token.platforms && (
        <div className="mx-auto w-2/3">
          <Heading size="h2">Contract Address</Heading>
          {Object.entries(token.platforms).map((platform) => (
            <p key={platform[0]}>
              {platform[0]}: <code>{platform[1]}</code>
            </p>
          ))}
        </div>
      )} */}

      {!!hodlId && (
        <p className="mb-4 text-center text-lg text-stone-400">
          Are you buying or selling?
        </p>
      )}

      <div className="mx-auto w-2/3">
        <AddHodlPositionForm hodl={positionFormHodl} token={token} />
      </div>
    </div>
  );
};

export default AddHodlPosition;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ coingecko_id: string }>,
) {
  if (!context.params?.coingecko_id) return;

  const session = await getServerAuthSession(context);

  if (!!session && session.user.id) {
    const hodl = await getHodlByTokenId({
      cgId: context.params?.coingecko_id,
      userId: session.user.id,
      prisma,
    });

    if (!!hodl) {
      const token: TokenWithoutDates = {
        ...hodl.token,
      };

      delete token.createdAt;
      delete token.updatedAt;

      return {
        props: {
          token,
          hodlId: hodl.id,
          hodlAmount: hodl.amount,
        },
      };
    }
  }

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
