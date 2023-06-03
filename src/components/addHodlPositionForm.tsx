// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TransactionType } from "@prisma/client";
import { TransactionValuesSchema } from "@/server/types";
import { useRouter } from "next/router";
// Types
import type { SubmitHandler } from "react-hook-form";
import type { TransactionValues } from "@/server/types";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw, Plus } from "lucide-react";

type AddPositionProps = {
  tokenId: string;
  hodlId: string;
  type?: "quick" | "full";
};

const AddHodlPositionForm = ({
  tokenId,
  hodlId,
  type = "quick",
}: AddPositionProps) => {
  const utils = api.useContext();
  const router = useRouter();
  const {
    register: registerInvestment,
    handleSubmit: handleSubmitInvestment,
    watch,
    control,
    setValue,
    // formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionValuesSchema),
  });

  const { mutate: addPosition, isLoading: isAddingPosition } =
    api.transaction.create.useMutation({
      onSuccess: async () => {
        await utils.wallet.get.invalidate().then(async () => {
          await router.push(`/hodl/${hodlId}`);
        });
      },
    });
  const { data: selectedToken, isSuccess: isTokenSuccess } =
    api.token.get.useQuery({ tokenId: tokenId }, { enabled: !!tokenId });
  const tokenPrice = isTokenSuccess ? parseFloat(selectedToken.latestPrice) : 0;
  const watchAmount = watch("amount", 0);
  const allowedTypes = Object.values(TransactionType).filter((type) =>
    ["BUY", "SELL"].includes(type)
  );

  // TODO: find elegant way to do so, maybe just change form types
  useEffect(() => {
    setValue("evaluation", watchAmount);
  }, [watchAmount, setValue]);

  const handleAddPosition: SubmitHandler<TransactionValues> = (data) => {
    const massaged: TransactionValues = {
      type: data.type,
      hodlId,
      amount: data.amount,
      evaluation: data.amount * tokenPrice,
    };

    addPosition(massaged);
  };

  const iconClass = clsx("h-4 w-4 mr-2", {
    "animate-spin": isAddingPosition,
  });

  return (
    <form
      className="mx-auto w-2/3 space-y-3"
      onSubmit={handleSubmitInvestment(handleAddPosition)}
    >
      <div className="flex items-end gap-3">
        <div>
          <Label htmlFor="name">Amount</Label>
          <Input
            type="number"
            disabled={isAddingPosition}
            placeholder="0.00"
            step="any"
            id="amount"
            {...registerInvestment("amount", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>Evaluation</Label>
          <Input
            disabled
            type="text"
            placeholder="0"
            value={
              watchAmount
                ? currencyConverter({
                    amount: watchAmount * tokenPrice,
                    type: "long",
                  })
                : "$0"
            }
          />
          <Input
            type="hidden"
            id="evaluation"
            step="any"
            {...registerInvestment("evaluation", { valueAsNumber: true })}
          />
        </div>

        {type === "full" ? (
          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  disabled={isAddingPosition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type of tx..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTypes.map((t) => (
                      <SelectItem className="cursor-pointer" key={t} value={t}>
                        {uppercaseFirst(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ) : null}

        <Button disabled={isAddingPosition} type="submit" className="ml-auto">
          {isAddingPosition ? (
            <>
              <RefreshCcw className={iconClass} /> Loading...
            </>
          ) : (
            <>
              <Plus className={iconClass} /> Add
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddHodlPositionForm;
