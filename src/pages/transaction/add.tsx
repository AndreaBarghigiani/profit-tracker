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
import { useEffect } from "react";

const AddTransaction: NextPage = () => {
  const router = useRouter();

  const projectId = router.query.projectId as string;
  const allowedTypes = Object.values(TransactionType).filter(
    (type) => !["BUY", "SELL"].includes(type)
  );

  const { mutate } = api.transaction.create.useMutation({
    onSuccess: async () => {
      await router.push(`/project/${projectId}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionValuesSchema),
    defaultValues: {
      type: "DEPOSIT",
      projectId,
    },
  });

  const watchAmount = watch("amount", 0);

  useEffect(() => {
    setValue("evaluation", watchAmount);
  }, [watchAmount, setValue]);

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
            step=".01"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>

        <Input
          type="hidden"
          id="evaluatioon"
          step=".01"
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
