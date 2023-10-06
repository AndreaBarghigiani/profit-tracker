// Utils
import { api } from "@/utils/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { currencyConverter, formatNumber } from "@/utils/string";

// Types
import type { TransactionRowValues } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DollarInput from "../DollarInput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const EditTransactionFormSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  price: z.string(),
});

const EditModal = ({
  transaction,
  setOpen,
}: {
  transaction: TransactionRowValues;
  setOpen: (boolean: boolean) => void;
}) => {
  const utils = api.useContext();
  const form = useForm<z.infer<typeof EditTransactionFormSchema>>({
    resolver: zodResolver(EditTransactionFormSchema),
    defaultValues: {
      amount: transaction.eval.amount,
      price: formatNumber(
        transaction.eval.evaluation / transaction.eval.amount,
        "standard",
      ),
    },
  });

  const { mutate: editTransaction, isLoading } =
    api.transaction.update.useMutation({
      onSuccess: async () => {
        await utils.hodl.getTransactions.invalidate();

        setOpen(false);
      },
      // onMutate: async (values) => {
      //   console.log("mutated values", values);
      //   transaction.eval.amount = values.amount;
      //   transaction.eval.evaluation = values.evaluation;
      // },
    });

  const onSubmit = (values: z.infer<typeof EditTransactionFormSchema>) => {
    const massaged = {
      ...values,
      id: transaction.id,
      evaluation: parseFloat(values.price) * values.amount,
    };
    editTransaction(massaged);
  };

  const [watchAmount, watchTokenPrice] = form.watch(["amount", "price"]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 items-center gap-5">
          <Input type="hidden" {...form.register("id")} />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" min={0} {...field} />
                  </FormControl>
                  <FormDescription>
                    Did you had a different token amount?
                  </FormDescription>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="price">Price</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                  {/* <DollarInput value={field.value} setValue={field.onChange} /> */}
                </FormControl>
                <FormDescription>
                  Do you need to change it&apos;s price?
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-md border border-input bg-dog-800 px-8 py-5">
          <Heading size="h4" spacing="small" className="mt-0 text-dog-400">
            Transaction value
          </Heading>
          <p className="text-4xl font-semibold text-dog-100">
            {watchAmount
              ? currencyConverter({
                  amount: watchAmount * Number(watchTokenPrice),
                })
              : "$0"}
          </p>
        </div>

        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
};

export default EditModal;
