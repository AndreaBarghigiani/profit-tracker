/* eslint-disable @typescript-eslint/no-unused-vars */
// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import { formatDate } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { useHodlTransactionModal } from "@/hooks/useTransactionModal";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import HodlTransactionCard from "@/components/ui/custom/HodlTransactionCard";
import { Button } from "@/components/ui/button";
import AddTransactionModal from "@/components/ui/custom/AddTransactionModal";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";
import HodlStats from "@/components/ui/custom/HodlStats";
import { Trash2, Plus, RefreshCcw, Banknote, Gift } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import AddAirdropForm from "@/components/ui/custom/AddAirdropForm";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ startDate, token, hodl }) => {
  const transactionModal = useHodlTransactionModal();
  const airdropModal = useHodlTransactionModal();
  const utils = api.useContext();
  const router = useRouter();
  const pageTitle = `Token ${token.name} Hodl page - Underdog Tracker`;
  const { data, isSuccess } = api.hodl.getTransactions.useQuery({
    hodlId: hodl.id,
  });

  const { mutateAsync: updatePrice, isLoading: isPriceLoading } =
    api.token.updatePrice.useMutation({
      onSuccess: async () => {
        await router.replace(router.asPath);
        // await utils.hodl.get.invalidate();
        // await utils.hodl.getDiffFromBuyes.invalidate();
        // await utils.token.get.invalidate();
      },
    });

  const { mutate: closePosition } = api.hodl.sellAll.useMutation({
    onSuccess: async () => {
      await utils.hodl.get.invalidate().then(async () => {
        await router.push(`/dashboard/`);
      });
    },
  });

  const { mutate: deletePosition } = api.hodl.delete.useMutation({
    onSuccess: async () => {
      await utils.wallet.get.invalidate().then(async () => {
        await router.push(`/dashboard/`);
      });
    },
  });

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="mx-auto space-y-4">
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
                Icon={Plus}
                iconClasses="h-4 w-4"
                btnVariants={{ size: "link" }}
              >
                <AddHodlPositionForm
                  hodlId={hodl.id}
                  token={token}
                  closeModal={() => transactionModal.setOpen(false)}
                />
              </AddTransactionModal>

              <AddTransactionModal
                size="large"
                transactionModal={airdropModal}
                Icon={Gift}
                iconClasses="h-4 w-4"
                btnVariants={{ size: "link", variant: "outline" }}
                modalContent={{
                  title: "Add airdrop",
                  description:
                    "Many projects reward their holders with tokens, and you're one of the lucky ones.",
                  tooltip: "Reward",
                }}
              >
                <div className="space-y-4">
                  <AddAirdropForm
                    closeModal={() => airdropModal.setOpen(false)}
                  />
                </div>
              </AddTransactionModal>

              <Button
                variant="outline"
                size="link"
                onClick={() => updatePrice({ tokenId: token.coingecko_id })}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex h-9 items-center justify-center px-3">
                        <RefreshCcw
                          className={clsx(" h-4 w-4", {
                            "animate-spin": isPriceLoading,
                          })}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="border-dog-800 text-dog-500">
                      <p>Update price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>

              <Button
                variant="outline-success"
                size="link"
                onClick={() =>
                  closePosition({
                    hodlId: hodl.id,
                    amount: hodl.amount,
                    price: token.latestPrice,
                  })
                }
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex h-9 items-center justify-center px-3">
                        <Banknote className="h-4 w-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="border-dog-800 text-dog-500">
                      <p>Sell & Close</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>

              <Button
                variant="outline-danger"
                size="link"
                onClick={() => deletePosition(hodl.id)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex h-9 items-center justify-center px-3">
                        <Trash2 className="h-4 w-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="border-dog-800 text-dog-500">
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
    </>
  );
};

export default Hodl;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
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

  const startDate = formatDate(hodlCreatedAt, "medium");

  return {
    props: {
      startDate,
      hodl,
      token: curToken,
    },
  };
}
