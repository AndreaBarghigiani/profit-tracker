// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import { currencyConverter, formatDate, uppercaseFirst } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { getToken } from "@/server/api/routers/token";
import { useHodlTransactionModal } from "@/hooks/useTransactionModal";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Heading from "@/components/ui/heading";
import HodlTransactionCard from "@/components/ui/custom/HodlTransactionCard";
import { Button } from "@/components/ui/button";
import AddTransactionModal from "@/components/ui/custom/AddTransactionModal";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";
import HodlStats from "@/components/ui/custom/HodlStats";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ startDate, token, hodl }) => {
  const transactionModal = useHodlTransactionModal();
  const utils = api.useContext();
  const router = useRouter();
  const { data, isSuccess } = api.hodl.getTransactions.useQuery({
    hodlId: hodl.id,
  });

  const { mutate: deletePosition } = api.hodl.delete.useMutation({
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

          <div className="ml-auto space-x-2">
            <AddTransactionModal
              size="large"
              transactionModal={transactionModal}
            >
              <AddHodlPositionForm
                hodlId={hodl.id}
                token={token}
                closeModal={() => transactionModal.setOpen(false)}
              />
            </AddTransactionModal>
            <Button
              variant="ghost-danger"
              onClick={() => deletePosition(hodl.id)}
            >
              Delete
            </Button>
          </div>
        </section>
      </header>

      <HodlStats hodl={hodl} token={token} />

      <section>
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

  const fullHodl = await getHodl({
    hodlId: context.params.id,
    prisma,
  });

  const {
    createdAt: hodlCreatedAt,
    updatedAt: hodlUpdatedAt,
    token,
    ...hodl
  } = fullHodl;

  const {
    createdAt: tokenCreatedAt,
    updatedAt: tokenUpdatedAt,
    ...curToken
  } = token;

  const startDate = formatDate(hodlCreatedAt);

  return {
    props: {
      startDate,
      hodl,
      token: curToken,
    },
  };
}
