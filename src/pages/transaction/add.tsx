/* eslint-disable @typescript-eslint/no-misused-promises */
// Utils
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { TransactionType } from "@prisma/client";
import { uppercaseFirst } from "@/utils/string";
import { TransactionValuesSchema } from "@/server/types";

// Types
import type { SubmitHandler } from "react-hook-form";
import type { NextPage } from "next";
import type { TransactionValues } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddTransaction: NextPage = () => {
  const router = useRouter();
  const utils = api.useContext();

  const projectId = router.query.projectId as string;
  const allowedTypes = Object.values(TransactionType).filter(
    (type) => !["BUY", "SELL"].includes(type)
  );

  const { mutate } = api.transaction.create.useMutation({
    onSuccess: async () => {
      await utils.wallet.getUserStats.invalidate().then(async () => {
        await router.push(`/project/${projectId}`);
      });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionValuesSchema),
    defaultValues: {
      type: "DEPOSIT",
      evaluation: 1,
    },
  });

  const onSubmit: SubmitHandler<TransactionValues> = (data) => {
    mutate(data);
  };

  return (
    <div>
      <Heading>Add Transaction</Heading>

      <form
        className="flex items-end space-x-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label htmlFor="amount">Transaction Amount</Label>
          <Input
            type="number"
            id="amount"
            step="any"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>

        <Input
          type="hidden"
          id="evaluation"
          step="any"
          {...register("evaluation", { valueAsNumber: true })}
        />

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

        <Button type="submit">Add Transaction</Button>
      </form>
    </div>
  );
};

export default AddTransaction;
