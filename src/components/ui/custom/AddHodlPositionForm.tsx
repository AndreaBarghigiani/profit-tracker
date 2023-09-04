// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { currencyConverter, uppercaseFirst } from "@/utils/string";

import { useState } from "react";
import { TransactionType } from "@prisma/client";
import { HodlTransactionSchema } from "@/server/types";
import { useRouter } from "next/router";

// Types
import type { SubmitHandler } from "react-hook-form";
import type {
  TokenZod,
  HodlTransaction,
  TokenWithoutDates,
  HodlPositionForm,
} from "@/server/types";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import { RefreshCcw, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

type AddPositionProps = {
  token: TokenWithoutDates | TokenZod;
  hodl?: HodlPositionForm;
  airdrop?: boolean;
  closeModal?: () => void | Promise<void>;
};

type AddPositionFormProps = HodlTransaction & {
  tokenPrice: number;
};

const AddHodlPositionForm = ({
  token,
  hodl,
  airdrop = false,
  closeModal,
}: AddPositionProps) => {
  const selectedToken = token;
  const utils = api.useContext();
  const hodlId = hodl?.hodlId;
  // const hodlAmount = hodl?.hodlAmount;
  const router = useRouter();
  const [useLiquidFunds, setUseLiquidFunds] = useState(false);
  const {
    register: registerInvestment,
    handleSubmit: handleSubmitInvestment,
    watch,
    control,
    setValue,
    // formState: { errors },
  } = useForm<AddPositionFormProps>({
    resolver: zodResolver(HodlTransactionSchema),
    defaultValues: {
      type: TransactionType.BUY,
      useLiquidFunds: false,
      amount: 0,
      tokenPrice: selectedToken.latestPrice,
    },
  });

  const { data: userWallet, isSuccess: isUserWalletSuccess } =
    api.wallet.get.useQuery();

  const { mutate: createPosition, isLoading: isCreatingPosition } =
    api.hodl.create.useMutation({
      onSuccess: async () => {
        await utils.hodl.getByCurrentUser.invalidate().then(async () => {
          if (!!closeModal) await closeModal();
          await router.push(`/hodl/`);
        });
        await utils.hodl.getTransactions.invalidate();
        await utils.hodl.getDiffFromBuyes.invalidate();
        await utils.wallet.getUserStats.invalidate();
      },
    });

  const { mutate: addPosition, isLoading: isAddingPosition } =
    api.hodl.transaction.useMutation({
      onSuccess: async (data) => {
        await utils.hodl.getByCurrentUser.invalidate().then(async () => {
          if (!!closeModal) await closeModal();
          if (!data) return;
          await router.push(`/hodl/${data}`);
        });
        await utils.hodl.getTransactions.invalidate();
        await utils.hodl.getDiffFromBuyes.invalidate();
        await utils.wallet.getUserStats.invalidate();
      },
    });

  const { mutateAsync: updatePrice, isLoading: isPriceLoading } =
    api.token.updatePrice.useMutation({
      onSuccess: async (data) => {
        await utils.token.get.invalidate();

        const token = data.pop();
        if (!token) return;
        setValue("tokenPrice", token.latestPrice);
      },
    });

  const [watchAmount, watchTokenPrice] = watch(["amount", "tokenPrice"]);
  const allowedTypes = ["BUY", "SELL"];

  const maxBuy =
    isUserWalletSuccess && useLiquidFunds
      ? userWallet?.liquidFunds / token.latestPrice
      : -1;
  const buttonDisabled =
    watchAmount === 0 || (maxBuy > 0 ? watchAmount > maxBuy : false);

  const handleAddPosition: SubmitHandler<HodlTransaction> = (data) => {
    const massaged: HodlTransaction = {
      type: data.type,
      amount: data.amount,
      airdrop,
      evaluation: data.amount * watchTokenPrice,
      useLiquidFunds: data.useLiquidFunds,
      status: "active",
    };

    if (!hodlId) {
      massaged.tokenId = selectedToken.coingecko_id;
      createPosition(massaged);
    } else {
      massaged.hodlId = hodlId;
      addPosition(massaged);
    }
  };

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmitInvestment(handleAddPosition)}
    >
      <div
        className={clsx("mb-5 flex items-end gap-6", {
          "justify-between": !hodlId && !airdrop,
        })}
      >
        {!airdrop ? (
          <Controller
            control={control}
            name="useLiquidFunds"
            render={() => (
              <>
                <ToggleGroup
                  type="single"
                  value={useLiquidFunds.toString()}
                  className="mt-6 flex justify-center"
                  onValueChange={(val) => {
                    setUseLiquidFunds(val === "true");
                    setValue("useLiquidFunds", val === "true");
                  }}
                >
                  <ToggleItem
                    className="disabled:cursor-not-allowed"
                    disabled={!userWallet?.liquidFunds}
                    value="true"
                  >
                    Liquid Funds
                  </ToggleItem>
                  <ToggleItem value="false">Fresh capital</ToggleItem>
                </ToggleGroup>
              </>
            )}
          />
        ) : null}
        <div>
          <Label htmlFor="name">Amount</Label>

          <Input
            type="number"
            disabled={isAddingPosition || isCreatingPosition}
            placeholder="0.00"
            {...(useLiquidFunds &&
              isUserWalletSuccess && {
                max: userWallet?.liquidFunds / token.latestPrice,
              })}
            step="any"
            id="amount"
            {...registerInvestment("amount", { valueAsNumber: true })}
          />

          {useLiquidFunds && isUserWalletSuccess ? (
            <span className="text-xs text-dog-600">
              You can only buy ~
              {`${(userWallet?.liquidFunds / token.latestPrice).toFixed(2)} 
              ${token.symbol.toUpperCase()}`}
            </span>
          ) : null}
        </div>
        <div>
          <Label>Price per token</Label>
          <div className="flex items-center">
            <Input
              type="number"
              step="any"
              disabled={isAddingPosition || isCreatingPosition}
              placeholder="0.00"
              id="tokenPrice"
              {...registerInvestment("tokenPrice", { valueAsNumber: true })}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    size="sm"
                    onClick={() =>
                      updatePrice({ tokenId: selectedToken.coingecko_id })
                    }
                  >
                    <RefreshCcw
                      className={clsx("h-4 w-4", {
                        "animate-spin": isPriceLoading,
                      })}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border-foreground/20">
                  <p>Update price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {!!hodlId && !airdrop && (
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  className="flex justify-center"
                  onValueChange={field.onChange}
                >
                  {allowedTypes.map((t) => (
                    <ToggleItem key={t} value={t}>
                      {uppercaseFirst(t)}
                    </ToggleItem>
                  ))}
                </ToggleGroup>
              </>
            )}
          />
        )}
      </div>

      <Input
        type="hidden"
        id="evaluation"
        step="any"
        {...registerInvestment("evaluation", { valueAsNumber: true })}
        value={watchAmount * watchTokenPrice}
      />

      <div className="rounded-md border border-input bg-dog-800 px-8 py-5">
        <Heading size="h4" spacing="small" className="mt-0 text-dog-400">
          Purchase Price
        </Heading>
        <p className="text-4xl font-semibold text-dog-100">
          {watchAmount
            ? currencyConverter({
                amount: watchAmount * watchTokenPrice,
              })
            : "$0"}
        </p>
      </div>

      <Button
        disabled={isAddingPosition || isCreatingPosition || buttonDisabled}
        type="submit"
        className="ml-auto"
      >
        {isAddingPosition || isCreatingPosition ? (
          <>
            <RefreshCcw
              className={clsx("h-4 w-4", {
                "animate-spin": isAddingPosition || isCreatingPosition,
              })}
            />
            <span className="ml-2">Loading...</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span className="ml-2">Add</span>
          </>
        )}
      </Button>
    </form>
  );
};

export default AddHodlPositionForm;
