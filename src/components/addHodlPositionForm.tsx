// Utils
import { api } from "@/utils/api";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { TransactionType } from "@prisma/client";
import { TransactionValuesSchema } from "@/server/types";

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
  const {
    register: registerInvestment,
    handleSubmit: handleSubmitInvestment,
    watch,
    control,
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionValuesSchema),
  });
  const { mutate: addPosition } = api.transaction.create.useMutation({
    onSuccess: async () => {
      console.log("success");
      await utils.wallet.get.invalidate();
    },
  });
  const { data: selectedToken, isSuccess: isTokenSuccess } =
    api.token.get.useQuery({ tokenId: tokenId }, { enabled: !!tokenId });
  const tokenPrice = isTokenSuccess ? parseFloat(selectedToken.latestPrice) : 0;
  const watchAmount = watch("amount", 0);
  const allowedTypes = Object.values(TransactionType).filter((type) =>
    ["BUY", "SELL"].includes(type)
  );

  const handleAddPosition: SubmitHandler<TransactionValues> = (data) => {
    const massaged: TransactionValues = {
      type: data.type,
      hodlId,
      amount: data.amount,
      evaluation: data.amount * tokenPrice,
    };

    addPosition(massaged);
  };

  return (
    <form
      className="mx-auto w-2/3 space-y-3"
      onSubmit={handleSubmitInvestment(handleAddPosition)}
    >
      <div className="flex gap-3">
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
            value={currencyConverter(watchAmount * tokenPrice)}
          />
        </div>

        {type === "full" ? (
          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
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
      </div>

      <Button type="submit">Add</Button>
    </form>
  );
};

export default AddHodlPositionForm;
