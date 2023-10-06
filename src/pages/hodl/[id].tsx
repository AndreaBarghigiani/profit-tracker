/* eslint-disable @typescript-eslint/no-unused-vars */
// Utils
import { api } from "@/utils/api";
import va from "@vercel/analytics";
import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/router";
import { prisma } from "@/server/db";
import { currencyConverter, formatDate } from "@/utils/string";
import { getHodl } from "@/server/api/routers/hodl";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { buttonVariants } from "@/components/ui/button";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import type { TokenWithoutDatesZod } from "@/server/types";

// Components
import Head from "next/head";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import HodlTransactionCard from "@/components/custom/HodlTransactionCard";
import { Button } from "@/components/ui/button";
import AddTransactionModal from "@/components/custom/GeneralModal";
import AddHodlPositionForm from "@/components/custom/AddHodlPositionForm";
import AddAirdropForm from "@/components/custom/AddAirdropForm";
import AddDcaForm from "@/components/custom/AddDcaForm";
import HodlStats from "@/components/custom/HodlStats";
import {
  MenuIcon,
  Trash2,
  Plus,
  RefreshCcw,
  Banknote,
  Gift,
  Coins,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import HodlTransactionsTable from "@/components/custom/Hodl/TransactionsTable";

const Hodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ startDate, token, hodl }) => {
  const transactionModal = useTransactionModal("Hodl transaction");
  const airdropModal = useTransactionModal("Hodl airdrop");
  const dcaModal = useTransactionModal("Hodl DCA Out strategy");
  const [menuOpen, setMenuOpen] = useState(false);

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
        await utils.token.getChartData.invalidate();
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
          <Heading
            className="mb-2"
            size={"page"}
            gradient="gold"
            spacing={"massive"}
          >
            {token.name}{" "}
            <span className="text-lg">({token.symbol?.toUpperCase()})</span>
          </Heading>
          <p className="text-center">
            You started this position at:{" "}
            <time dateTime={startDate}>{startDate}</time>
          </p>
        </header>

        <section className="flex items-center">
          <Link
            href="/hodl"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hodls
          </Link>

          <div className="ml-auto flex items-center space-x-2">
            <AddTransactionModal
              size="large"
              transactionModal={transactionModal}
              Icon={Plus}
              iconClasses="mr-2 h-4 w-4"
              triggerText="Transaction"
              btnVariants={{
                size: "sm",
              }}
            >
              <AddHodlPositionForm
                hodl={{ hodlId, hodlAmount }}
                token={token}
                closeModal={() => transactionModal.setOpen(false)}
              />
            </AddTransactionModal>

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMenuOpen(true)}
                >
                  {isPriceLoading ? (
                    <RefreshCcw
                      className={clsx("mr-2 h-4 w-4", {
                        "animate-spin": isPriceLoading,
                      })}
                    />
                  ) : (
                    <MenuIcon className="mr-2 h-4 w-4" />
                  )}
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 border-dog-750 bg-dog-850 text-dog-400"
              >
                <AddTransactionModal
                  size="large"
                  transactionModal={dcaModal}
                  customTrigger={() => (
                    <DropdownMenuItem
                      asChild
                      onSelect={(e) => e.preventDefault()}
                      onClick={() => dcaModal.setOpen(true)}
                    >
                      <Button
                        size="link"
                        variant="ghost"
                        className="ml-auto w-full cursor-pointer justify-start text-right transition-colors duration-200 focus:bg-dog-800 focus:text-main-500"
                      >
                        <Coins className="mr-2 h-4 w-4" />
                        Exit Strategy
                      </Button>
                    </DropdownMenuItem>
                  )}
                  modalContent={{
                    title: "Add your Exit Strategy",
                    description: `You can add your strategy and study how to DCA Out from ${token.name} and discover how much will you earn selling at a specific prices.`,
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
                  customTrigger={() => (
                    <DropdownMenuItem
                      asChild
                      onSelect={(e) => e.preventDefault()}
                      onClick={() => airdropModal.setOpen(true)}
                    >
                      <Button
                        size="link"
                        variant="ghost"
                        className="ml-auto w-full cursor-pointer justify-start text-right transition-colors duration-200 focus:bg-dog-800 focus:text-main-500"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Reward
                      </Button>
                    </DropdownMenuItem>
                  )}
                  modalContent={{
                    title: "Add airdrop",
                    description:
                      "Many projects reward their holders with tokens, and you're one of the lucky ones.",
                  }}
                >
                  <div className="space-y-4">
                    <AddAirdropForm
                      closeModal={() => airdropModal.setOpen(false)}
                    />
                  </div>
                </AddTransactionModal>

                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    size="link"
                    className="ml-auto w-full cursor-pointer justify-start text-right transition-colors duration-200 focus:bg-dog-800 focus:text-main-500"
                    onClick={async () => {
                      va.track("Update Hodls Prices");
                      await updatePrice({ tokenId: token.coingecko_id });
                    }}
                  >
                    <RefreshCcw
                      className={clsx("mr-2 h-4 w-4", {
                        "animate-spin": isPriceLoading,
                      })}
                    />
                    Update price
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    size="link"
                    className="ml-auto w-full cursor-pointer justify-start text-right transition-colors duration-200 focus:bg-dog-800 focus:text-success-600"
                    onClick={() => {
                      va.track("Close Hodl Position");
                      closePosition({
                        hodlId: hodl.id,
                        amount: hodl.amount,
                        price: token.latestPrice,
                      });
                    }}
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    Sell & Close
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    size="link"
                    className="ml-auto w-full cursor-pointer justify-start text-right transition-colors duration-200  focus:bg-dog-800 focus:text-alert-400"
                    onClick={() => {
                      va.track("Delete Hodl Position");
                      deletePosition(hodl.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        <HodlStats hodl={hodl} token={token} />

        {isSuccess && transactions ? (
          <section>
            <HodlTransactionsTable
              transactions={transactions}
              token={token as TokenWithoutDatesZod}
            />

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
          </section>
        ) : null}
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
