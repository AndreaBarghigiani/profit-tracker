/* eslint-disable @typescript-eslint/no-misused-promises */
// Utils
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { TransactionType } from "@prisma/client";

// Types
import type { SubmitHandler } from "react-hook-form";
import type { NextPage } from "next";

// Components
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

export const TransactionValuesSchema = z.object({
  amount: z.number(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string(),
});

type TransactionValues = z.infer<typeof TransactionValuesSchema>;

const AddTransaction: NextPage = () => {
  const { register, handleSubmit, control } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionValuesSchema),
    defaultValues: {
      type: "DEPOSIT",
    },
  });

  const router = useRouter();

  const projectId = router.query.projectId as string;

  const { mutate } = api.transaction.create.useMutation({
    onSuccess: async () => {
      await router.push(`/project/${projectId}`);
    },
  });

  const onSubmit: SubmitHandler<TransactionValues> = (data) => {
    const transaction = {
      ...data,
      type: data.type as TransactionType,
      projectId,
    };
    mutate(transaction);
  };

  const txType = ["deposit", "withdraw", "interest"];

  return (
    <div>
      <h1>Add Transaction</h1>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="amount">Transaction Amount</Label>
          <Input
            type="number"
            id="amount"
            step=".01"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>

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
                  {txType.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
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
