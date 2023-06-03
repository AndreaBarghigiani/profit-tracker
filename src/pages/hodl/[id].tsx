// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import { currencyConverter, formatDate, uppercaseFirst } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { getToken } from "@/server/api/routers/token";
import { buttonVariants } from "@/components/ui/button";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Heading from "@/components/ui/heading";
import HodlTransactionCard from "@/components/ui/custom/HodlTransactionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ hodlId, startDate, amount, evaluation, total, token }) => {
  const utils = api.useContext();
  const router = useRouter();
  const { data, isSuccess } = api.hodl.getTransactions.useQuery({
    hodlId,
  });

  const { mutate: deletePosition, isLoading: isDeletingPosition } =
    api.hodl.delete.useMutation({
      onSuccess: async () => {
        await utils.wallet.get.invalidate().then(async () => {
          await router.push(`/dashboard/`);
        });
      },
    });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          {token.name}{" "}
          <span className="text-lg">({token.symbol?.toUpperCase()})</span>
        </Heading>

        <section className="flex items-end">
          <p>
            You started this position at:{" "}
            <time dateTime={startDate}>{startDate}</time>
          </p>

          <Link
            className={buttonVariants({ className: "ml-auto" })}
            href={`/hodl/add/${hodlId}`}
          >
            Add a new position
          </Link>
          <Button variant="link" onClick={() => deletePosition(hodlId)}>
            Delete
          </Button>
        </section>
      </header>

      <section>
        <header className="my-4 flex justify-between gap-4 rounded-md border border-stone-500 bg-background px-4 py-2">
          <div>
            <Heading size="h4">Amount</Heading>
            <p>
              {amount} {uppercaseFirst(token.symbol)}
            </p>
          </div>
          <div>
            <Heading size="h4">Current Value</Heading>
            <p>{currencyConverter({ amount: evaluation })}</p>
          </div>
          <div>
            <Heading size="h4">Invested</Heading>
            <p>{currencyConverter({ amount: total })}</p>
          </div>
          <div>
            <Heading size="h4">Token current price</Heading>
            <p>{currencyConverter({ amount: token.price, type: "long" })}</p>
          </div>
        </header>

        {isSuccess && data.transaction ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 rounded-md bg-foreground/30">
              <p className="p-3">Amount</p>
              <p className="p-3">Type</p>
              <p className="p-3">Date</p>
            </div>
            {data.transaction.map((transaction) => (
              <HodlTransactionCard
                transaction={transaction}
                token={token}
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

  const startDate = formatDate(hodl.createdAt);

  const token = await getToken({
    tokenId: hodl.tokenId,
    prisma,
  });

  return {
    props: {
      hodlId: context.params.id,
      startDate,
      amount: hodl.currentAmount,
      evaluation: hodl.currentEvaluation,
      total: hodl.totalInvested,
      token: {
        name: token.name,
        symbol: token.symbol,
        icon: token.iconUrl,
        price: token.latestPrice,
      },
    },
  };
}
