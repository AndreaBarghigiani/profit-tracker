/* eslint-disable @typescript-eslint/no-misused-promises */
// Utils
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { TransactionType } from "@prisma/client";
import { uppercaseFirst } from "@/utils/string";

// Types
import type { SubmitHandler } from "react-hook-form";
import type { NextPageWithLayout } from "../_app";

// Components
import LayoutDashboard from "@/components/layoutDashboard";
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

export const TransactionValuesSchema = z.object({
  amount: z.number(),
  type: z.nativeEnum(TransactionType),
  projectId: z.string(),
});

type TransactionValues = z.infer<typeof TransactionValuesSchema>;

const AddTransaction: NextPageWithLayout = () => {
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

  return (
    <div>
      <Heading>Add Transaction</Heading>

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
                  {Object.values(TransactionType).map((t) => (
                    <SelectItem key={t} value={t}>
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

AddTransaction.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default AddTransaction;
