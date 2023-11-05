// Utils
import { api } from "@/utils/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { currencyConverter, formatNumber } from "@/utils/string";

// Types
import type { TransactionRowValues } from "@/server/types";

// Components
import { HelpCircle } from "lucide-react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

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

  const { mutate: editTransaction } = api.transaction.update.useMutation({
    onSuccess: async () => {
      await utils.hodl.getTransactions.invalidate();

      setOpen(false);
    },
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
                  <div className="flex items-center justify-start">
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 h-4 w-4 text-dog-400" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="border-dog-800 text-dog-500"
                        >
                          Change amount of the token
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input type="number" step="any" min={0} {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-start">
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-2 h-4 w-4 text-dog-400" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="border-dog-800 text-dog-500"
                      >
                        Change price of the token
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input type="text" {...field} />
                  {/* <DollarInput value={field.value} setValue={field.onChange} /> */}
                </FormControl>
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
