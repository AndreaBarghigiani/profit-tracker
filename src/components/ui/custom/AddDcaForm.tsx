// Utils
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { percentageOf } from "@/utils/number";

// Types
import type {
  HodlWithoutDates,
  TokenWithoutDates,
  TokenZod,
} from "@/server/types";
import type { DcaStrategy, DcaSteps } from "@prisma/client";

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import DollarInput from "@/components/ui/custom/DollarInput";
import { Minus, RefreshCcw, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const AddDcaFormSchema = z.object({
  steps: z.array(
    z.object({
      percentage: z.number().positive().max(100),
      price: z.number().positive(),
    }),
  ),
});

type AddDcaFormProps = z.infer<typeof AddDcaFormSchema>;

type DcaPageProps = (DcaStrategy & { dcaSteps: DcaSteps[] }) | undefined | null;

type AddDcaProps = {
  token: TokenWithoutDates | TokenZod;
  hodl: HodlWithoutDates;
  dcaStrategy: DcaPageProps;
  closeModal?: () => void | Promise<void>;
};

const AddDcaForm = ({ token, hodl, dcaStrategy, closeModal }: AddDcaProps) => {
  let defaultValues: Partial<AddDcaFormProps> = {
    steps: [
      {
        percentage: 10,
        price: token.latestPrice,
      },
    ],
  };

  const form = useForm<AddDcaFormProps>({
    resolver: zodResolver(AddDcaFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "steps",
    control: form.control,
  });

  const [watchSteps] = form.watch(["steps"]);

  const totals = watchSteps.reduce(
    (acc, curr) => {
      const availableTokens = hodl.amount - acc.tokens;
      const totTokens =
        acc.tokens + percentageOf(availableTokens, curr.percentage);
      const totDollars = acc.dollars + totTokens * curr.price;
      const totPercentages = acc.percentages + curr.percentage;

      return {
        tokens: totTokens,
        dollars: totDollars,
        percentages: totPercentages,
      };
    },
    { tokens: 0, dollars: 0, percentages: 0 },
  );

  const sellableTokens = percentageOf(hodl.amount, totals.percentages);

  const diffWithExposure = totals.dollars - hodl.exposure;

  const { data: avgPrice, isSuccess: isAvgPriceSuccess } =
    api.hodl.getDiffFromBuyes.useQuery(
      {
        hodlId: hodl.id,
        hodlAmount: hodl.amount,
        tokenLatestPrice: token.latestPrice,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  if (dcaStrategy?.dcaSteps) {
    defaultValues = {
      ...dcaStrategy,
      steps: dcaStrategy.dcaSteps.map((step) => ({
        percentage: step.percentage,
        price: step.price,
      })),
    };
  }

  const { mutate: createDca, isLoading: isCreateDcaLoading } =
    api.dca.create.useMutation({
      onSuccess: async () => {
        if (!!closeModal) await closeModal();
      },
    });

  const { mutate: updateDca, isLoading: isUpdateDcaLoading } =
    api.dca.update.useMutation({
      onSuccess: async () => {
        if (!!closeModal) await closeModal();
      },
    });

  function onSubmit(values: AddDcaFormProps) {
    const massaged = {
      hodlId: hodl.id,
      ...values,
    };

    if (!!dcaStrategy) {
      updateDca(massaged);
    } else {
      createDca(massaged);
    }
  }

  return (
    <Form {...form}>
      <div className="flex items-center rounded bg-dog-800 px-6 py-4">
        <Image
          src={token.iconUrl ?? "/placeholder.png"}
          alt={token.name}
          className="mr-4 flex-shrink-0 rounded-full"
          width={48}
          height={48}
        />
        <div className="flex w-full justify-between">
          <div>
            <Heading as="h3" size="h4" spacing="none">
              {token.name}
            </Heading>
            <span className="text-xs text-dog-500">
              [{token.symbol.toUpperCase()}]
            </span>
          </div>

          <div>
            <Heading as="h3" size="h4" spacing="none">
              Exposed
            </Heading>
            <span className="text-xs text-dog-500">
              {currencyConverter({ amount: hodl.exposure })}
            </span>
          </div>

          <div>
            <Heading as="h3" size="h4" spacing="none">
              Cost per token
            </Heading>
            <span className="text-xs text-dog-500">
              {isAvgPriceSuccess &&
                currencyConverter({ amount: avgPrice.average })}
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {fields.map((field, index) => (
            <div className="flex items-center gap-x-6" key={field.id}>
              <FormField
                control={form.control}
                name={`steps.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Prospected price
                    </FormLabel>
                    <FormControl>
                      <DollarInput
                        placeholder={field.value.toString()}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`steps.${index}.percentage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn("flex justify-between", {
                        "sr-only": index !== 0,
                      })}
                    >
                      <span>Percentage</span>
                      <span
                        className={cn("mr-2 font-semibold", {
                          "text-alert-600": totals.percentages > 100,
                        })}
                      >
                        {totals.percentages}%
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex h-9 items-center gap-x-3">
                        <Slider
                          className="w-[200px]"
                          onValueChange={(value) => {
                            field.onChange(value.pop());
                          }}
                          value={[field.value]}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <span className="w-10 text-sm text-dog">
                          {field.value}%
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {index !== 0 && (
                <Button
                  type="button"
                  variant="outline-input"
                  size="xs"
                  className=" mt-2"
                  onClick={() => remove(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline-input"
            size="sm"
            className="mt-3"
            disabled={totals.percentages > 100}
            onClick={() => append({ percentage: 0, price: 0 })}
          >
            Add step
          </Button>

          <div className="mt-5 grid grid-cols-4 items-center rounded bg-dog-800 px-6 py-4">
            <div>
              <Heading size="h3" className="text-dog-100">
                Sell
              </Heading>
              <p className="text-dog-500">
                {sellableTokens < hodl.amount
                  ? sellableTokens.toFixed(2)
                  : hodl.amount.toFixed(2)}{" "}
                <span className="text-xs">{token.symbol.toUpperCase()}</span>
              </p>
            </div>

            <div>
              <Heading size="h3" className="text-dog-100">
                Keep
              </Heading>
              <p className="text-dog-500">
                {sellableTokens < hodl.amount
                  ? (
                      hodl?.amount -
                      percentageOf(hodl?.amount, totals.percentages)
                    ).toFixed(2)
                  : 0}{" "}
                <span className="text-xs">{token.symbol.toUpperCase()}</span>
              </p>
            </div>

            <div>
              <Heading size="h3" className="text-dog-100">
                Total
              </Heading>
              <p>
                <strong className=" text-dog-500">
                  {currencyConverter({ amount: totals.dollars.toFixed(2) })}
                </strong>
              </p>
            </div>

            <div>
              <Heading size="h3" className="text-dog-100">
                {diffWithExposure > 0 ? "Profit" : "Exposed"}
              </Heading>
              <p className=" text-dog-500">
                {currencyConverter({
                  amount: diffWithExposure,
                })}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={
            totals.percentages > 100 || isCreateDcaLoading || isUpdateDcaLoading
          }
        >
          {isCreateDcaLoading || isUpdateDcaLoading ? (
            <>
              <RefreshCcw
                className={cn("h-4 w-4", {
                  "animate-spin": isCreateDcaLoading || isUpdateDcaLoading,
                })}
              />
              <span className="ml-2">Loading...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span className="ml-2">Save</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddDcaForm;
