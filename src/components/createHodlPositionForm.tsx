// Utils
import { z } from "zod";
import { api } from "@/utils/api";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter } from "@/utils/string";
import { useRouter } from "next/router";

// Types
import type { HodlValues } from "@/server/types";
import type { SubmitHandler } from "react-hook-form";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { RefreshCcw, Plus } from "lucide-react";

export const CreatePositionValuesSchema = z.object({
  amount: z.number(),
});

export type CreatePositionValues = z.infer<typeof CreatePositionValuesSchema>;

export default function CreateHodlPositionForm({
  tokenId,
}: {
  tokenId: string;
}) {
  const utils = api.useContext();
  const router = useRouter();
  const { mutate: createPosition, isLoading: isCreatingPositionLoading } =
    api.hodl.create.useMutation({
      onSuccess: async (data) => {
        await utils.wallet.get.invalidate().then(async () => {
          await router.push(`/hodl/${data.id}`);
        });
      },
    });
  const { data: selectedToken, isSuccess: isTokenSuccess } =
    api.token.get.useQuery({ tokenId: tokenId }, { enabled: !!tokenId });
  const {
    register: registerInvestment,
    handleSubmit: handleSubmitInvestment,
    watch,
  } = useForm<CreatePositionValues>({
    resolver: zodResolver(CreatePositionValuesSchema),
  });
  const tokenPrice = isTokenSuccess ? parseFloat(selectedToken.latestPrice) : 0;
  const watchAmount = watch("amount", 0);
  const handleAddPosition: SubmitHandler<CreatePositionValues> = (data) => {
    const massaged: HodlValues = {
      tokenId,
      currentAmount: data.amount,
      currentEvaluation: data.amount * tokenPrice,
      totalInvested: data.amount * tokenPrice,
    };
    createPosition(massaged);
  };

  const iconClass = clsx("h-4 w-4 mr-2", {
    "animate-spin": isCreatingPositionLoading,
  });

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmitInvestment(handleAddPosition)}
    >
      <div className="flex justify-between">
        <div>
          <Label htmlFor="name">Amount</Label>
          <Input
            type="number"
            disabled={isCreatingPositionLoading}
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
            value={currencyConverter({ amount: watchAmount * tokenPrice })}
          />
        </div>
      </div>

      <Button disabled={isCreatingPositionLoading} type="submit">
        {isCreatingPositionLoading ? (
          <>
            <RefreshCcw className={iconClass} /> Loading...
          </>
        ) : (
          <>
            <Plus className={iconClass} /> Create
          </>
        )}
      </Button>
    </form>
  );
}
