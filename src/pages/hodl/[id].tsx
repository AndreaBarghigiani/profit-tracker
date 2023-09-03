/* eslint-disable @typescript-eslint/no-unused-vars */
// Utils
import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import { formatDate } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import va from "@vercel/analytics";

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
import AddAirdropForm from "@/components/ui/custom/AddAirdropForm";
import AddDcaForm from "@/components/ui/custom/AddDcaForm";
import HodlStats from "@/components/ui/custom/HodlStats";
import { Trash2, Plus, RefreshCcw, Banknote, Gift, Coins } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ startDate, token, hodl }) => {
  const transactionModal = useTransactionModal("Hodl transaction");
  const airdropModal = useTransactionModal("Hodl airdrop");
  const dcaModal = useTransactionModal("Hodl DCA Out strategy");

  const utils = api.useContext();
  const router = useRouter();
  const pageTitle = `Token ${token.name} Hodl page - Underdog Tracker`;

  const { id: hodlId, amount: hodlAmount } = hodl;

  const refreshPage = async () => {
    await router.replace(router.asPath, undefined, { scroll: false });
  };

  const { data: transactions, isSuccess } = api.hodl.getTransactions.useQuery({
    hodlId: hodl.id,
  });

  const { data: dcaStrategy } = api.dca.get.useQuery({ hodlId: hodl.id });

  const { mutateAsync: updatePrice, isLoading: isPriceLoading } =
    api.token.updatePrice.useMutation({
      onSuccess: async () => {
        await refreshPage();
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
                  hodl={{ hodlId, hodlAmount }}
                  token={token}
                  closeModal={() => transactionModal.setOpen(false)}
                />
              </AddTransactionModal>

              <AddTransactionModal
                size="large"
                transactionModal={dcaModal}
                Icon={Coins}
                iconClasses="h-4 w-4"
                btnVariants={{
                  size: "link",
                  variant: dcaStrategy ? "orange" : "outline-orange",
                }}
                modalContent={{
                  title: "Add your DCA Out Strategy",
                  description: `You can add your DCA Out strategy for ${token.name} to see how much you will earn if you sell your tokens at a specific price.`,
                  tooltip: "DCA Out",
                }}
              >
                <AddDcaForm
                  hodl={hodl}
                  token={token}
                  dcaStrategy={dcaStrategy}
                  closeModal={() => dcaModal.setOpen(false)}
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
                onClick={async () => {
                  va.track("Update Hodls Prices");
                  await updatePrice({ tokenId: token.coingecko_id });
                }}
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
                onClick={() => {
                  va.track("Close Hodl Position");
                  closePosition({
                    hodlId: hodl.id,
                    amount: hodl.amount,
                    price: token.latestPrice,
                  });
                }}
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
                onClick={() => {
                  va.track("Delete Hodl Position");
                  deletePosition(hodl.id);
                }}
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
          {isSuccess && transactions ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 rounded-md bg-foreground/30">
                <p className="p-3">Amount</p>
                <p className="p-3">Type</p>
                <p className="p-3">Date</p>
              </div>
              {transactions.map((transaction) => (
                <HodlTransactionCard
                  transaction={transaction}
                  token={token}
                  key={transaction.id}
                  refresher={refreshPage}
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
    token: fullToken,
    ...hodl
  } = fullHodl;

  const {
    createdAt: tokenCreatedAt,
    updatedAt: tokenUpdatedAt,
    ...token
  } = fullToken;

  const startDate = formatDate(hodlCreatedAt, "medium");

  return {
    props: {
      startDate,
      hodl,
      token,
    },
  };
}
