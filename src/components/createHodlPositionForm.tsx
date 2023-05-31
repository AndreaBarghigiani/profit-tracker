// Utils
import { z } from "zod";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter } from "@/utils/string";
import { HodlValuesSchema } from "@/server/types";

// Types
import type { HodlValues } from "@/server/types";
import type { SubmitHandler } from "react-hook-form";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";

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
  const { mutate: createPosition } = api.hodl.create.useMutation({
    onSuccess: async () => {
      console.log("success");
      await utils.wallet.get.invalidate();
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
            step=".01"
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

      <Button type="submit">Add</Button>
    </form>
  );
}
