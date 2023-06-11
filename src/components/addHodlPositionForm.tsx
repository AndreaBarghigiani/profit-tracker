// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TransactionType } from "@prisma/client";
import { TransactionValuesSchema } from "@/server/types";
import { useRouter } from "next/router";

// Types
import type { SubmitHandler } from "react-hook-form";
import type { TransactionValues, TokenWithoutDates } from "@/server/types";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { RefreshCcw, Plus } from "lucide-react";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";
import Heading from "@/components/ui/heading";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

type AddPositionProps = {
  token: TokenWithoutDates;
  hodlId: string | null;
};

type AddPositionFormProps = TransactionValues & {
  tokenPrice: number;
};

const AddHodlPositionForm = ({ token, hodlId }: AddPositionProps) => {
  const selectedToken = token;
  const utils = api.useContext();
  const router = useRouter();
  const {
    register: registerInvestment,
    handleSubmit: handleSubmitInvestment,
    watch,
    control,
    setValue,
    // formState: { errors },
  } = useForm<AddPositionFormProps>({
    resolver: zodResolver(TransactionValuesSchema),
    defaultValues: {
      type: TransactionType.BUY,
      amount: 0,
      tokenPrice: parseFloat(selectedToken.latestPrice),
    },
  });

  const { mutate: createPosition, isLoading: isCreatingPosition } =
    api.hodl.create.useMutation({
      onSuccess: async (data) => {
        if (!data?.id) return;
        await utils.wallet.get.invalidate().then(async () => {
          await router.push(`/hodl/${data.id}`);
        });
      },
    });

  const { mutate: addPosition, isLoading: isAddingPosition } =
    api.transaction.create.useMutation({
      onSuccess: async (data) => {
        await utils.wallet.get.invalidate().then(async () => {
          if (!data?.hodlId) return;
          await router.push(`/hodl/${data.hodlId}`);
        });
      },
    });

  const { mutateAsync: updatePrice, isLoading: isPriceLoading } =
    api.token.updatePrice.useMutation({
      onSuccess: async (data) => {
        await utils.token.get.invalidate();
        const token = data.pop();
        if (!token) return;
        setValue("tokenPrice", parseFloat(token.latestPrice));
      },
    });

  const [watchAmount, watchTokenPrice] = watch(["amount", "tokenPrice"]);
  const allowedTypes = Object.values(TransactionType).filter((type) =>
    ["BUY", "SELL"].includes(type)
  );

  const handleAddPosition: SubmitHandler<TransactionValues> = (data) => {
    const massaged: TransactionValues = {
      type: data.type,
      amount: data.amount,
      evaluation: data.amount * watchTokenPrice,
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
      className="mx-auto w-2/3 space-y-3"
      onSubmit={handleSubmitInvestment(handleAddPosition)}
    >
      <div className="flex items-end justify-between">
        <div>
          <Label htmlFor="name">Amount</Label>
          <Input
            type="number"
            disabled={isAddingPosition || isCreatingPosition}
            placeholder="0.00"
            step="any"
            id="amount"
            {...registerInvestment("amount", { valueAsNumber: true })}
          />
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

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
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
          )}
        />
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
          Evaluation
        </Heading>
        <p className="text-4xl font-semibold text-dog-100">
          {watchAmount
            ? currencyConverter({
                amount: watchAmount * watchTokenPrice,
                type: "long",
              })
            : "$0"}
        </p>
      </div>
      <Button
        disabled={isAddingPosition || isCreatingPosition}
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
