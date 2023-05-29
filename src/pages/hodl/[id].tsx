// Utils
import { api } from "@/utils/api";
import { prisma } from "@/server/db";
import { formatDate } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { getToken } from "@/server/api/routers/token";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Heading from "@/components/ui/heading";
import HodlTransactionCard from "@/components/ui/custom/HodlTransactionCard";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ hodlId, amount, evaluation, total, token }) => {
  const { data, isSuccess } = api.hodl.getTransactions.useQuery({
    hodlId,
  });
  // if (isSuccess) {
  //   const { createdAt, transaction: transactions } = data;
  //   console.log("transactions:", transactions);
  //   console.log("createdAt:", createdAt);
  // }
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          {token.name}{" "}
          <span className="text-lg">({token.symbol?.toUpperCase()})</span>
        </Heading>

        {isSuccess && data.createdAt ? (
          <p>
            You started this position at:{" "}
            <time dateTime={data.createdAt.toString()}>
              {formatDate.format(data.createdAt)}
            </time>
          </p>
        ) : null}
      </header>

      <section>
        <p>Amount: {amount}</p>
        <p>Evaluation: {evaluation}</p>
        <p>Total: {total}</p>

        {isSuccess && data.transaction ? (
          <div className="space-y-3">
            {data.transaction.map((transaction) => (
              <HodlTransactionCard
                transaction={transaction}
                key={transaction.id}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Hodl;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  if (!context.params?.id) return;

  const hodl = await getHodl({
    hodlId: context.params.id,
    prisma,
  });

  const token = await getToken({
    tokenId: hodl.tokenId,
    prisma,
  });

  return {
    props: {
      hodlId: context.params.id,
      amount: hodl.currentAmount,
      evaluation: hodl.currentEvaluation,
      total: hodl.totalInvested,
      token: {
        name: token.name,
        symbol: token.symbol,
        icon: token.iconUrl,
      },
    },
  };
}
