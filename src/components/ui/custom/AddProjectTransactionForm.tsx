// Utils
import { api } from "@/utils/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { currencyConverter, uppercaseFirst } from "@/utils/string";

// Types
import type { Project } from "@prisma/client";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AddProjectTransactionFormSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAW", "REMOVE"]),
  amount: z.number().positive(),
  projectId: z.string(),
});

const AddProjectTransactionForm = ({
  project,
  setOpen,
}: {
  project: Project;
  setOpen: (boolean: boolean) => void;
}) => {
  const utils = api.useContext();
  const form = useForm<z.infer<typeof AddProjectTransactionFormSchema>>({
    resolver: zodResolver(AddProjectTransactionFormSchema),
    defaultValues: {
      type: "DEPOSIT",
      amount: 0,
      projectId: project.id,
    },
  });

  const { mutate: createTransaction } = api.project.transaction.useMutation({
    onSuccess: async () => {
      await utils.wallet.getUserStats.invalidate();
      await utils.project.get.invalidate();
      await utils.transaction.list.invalidate();
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof AddProjectTransactionFormSchema>) {
    const massaged = {
      ...values,
      evaluation: values.amount,
    };
    createTransaction(massaged);
  }

  const watchType = form.watch("type");
  const watchAmount = form.watch("amount");

  const typeContent = {
    WITHDRAW: (
      <>
        You cannot withdraw more than{" "}
        <strong>{currencyConverter({ amount: project.interest })}</strong>
      </>
    ),
    REMOVE: (
      <>
        You&apos;ll remove from your deposit, you cannot remove more than{" "}
        <strong>{currencyConverter({ amount: project.moneyAtWork })}</strong>
      </>
    ),
  };

  const maxWithdrawable = {
    REMOVE: project.deposit,
    WITHDRAW: project.interest,
  };

  const buttonDisabled =
    watchAmount === 0 || watchAmount > maxWithdrawable[watchType];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel htmlFor="type">Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  <TransactionTypeRadio value="DEPOSIT" />
                  <TransactionTypeRadio value="WITHDRAW" />
                  <TransactionTypeRadio value="REMOVE" />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <FormDescription>
                How much money do you want to add or remove?
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="any"
                  min={0}
                  {...(watchType !== "DEPOSIT" && {
                    max: maxWithdrawable[watchType],
                  })}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs text-alert-200">
                {typeContent[watchType]}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button disabled={buttonDisabled} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddProjectTransactionForm;

const TransactionTypeRadio = ({ value }: { value: string }) => {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="cursor-pointer">{uppercaseFirst(value)}</FormLabel>
    </FormItem>
  );
};
