// Utils
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { currencyConverter } from "@/utils/string";
import { calcPercentageVariance } from "@/utils/number";

// Types
import type { Token } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
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
import TokenSearchInput from "@/components/ui/custom/TokenSearchInput";

const formSchema = z.object({
  amount: z.number().positive(),
  estimate: z.number().positive(),
  sell: z.number().positive(),
});

const Estimator = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      estimate: 0,
    },
  });

  const [watchAmount, watchEstimate, watchSell] = form.watch([
    "amount",
    "estimate",
    "sell",
  ]);
  console.log("watchAmount:", watchAmount);

  const tokenAmount = watchAmount / watchEstimate;

  useEffect(() => {
    if (!selectedToken) return;

    form.setValue("estimate", selectedToken.latestPrice);
  }, [selectedToken, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        How much can you profit?
      </Heading>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-8">
          <div className="grid grid-cols-3 items-center gap-4">
            <TokenSearchInput onTokenSelection={setSelectedToken} />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How much have you bought?</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>At what price?</FormLabel>
                  <FormControl>
                    <Input {...field} className="arrow-hide" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-start-2">
              <Heading size="h3">You bought</Heading>
              <p className="text-xl text-dog-500">
                {tokenAmount} {selectedToken?.symbol.toUpperCase()}
              </p>
            </div>

            <div>
              <FormField
                control={form.control}
                name="sell"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>At which price should we sell?</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button className="mx-auto" type="submit">
            Estimate
          </Button>
        </form>
      </Form>

      <div className="col-span-2 col-start-2 mx-auto max-w-xl rounded-lg border border-dog-750 bg-dog-850 px-2 py-5">
        <Heading size="h1" className="mt-0 text-center">
          You will profit
        </Heading>

        <div className="grid grid-cols-3 justify-around">
          <div className="text-center">
            <Heading size="h4" className="mb-1 text-dog-500">
              Total
            </Heading>
            <p className="text-3xl font-semibold">
              {currencyConverter({ amount: tokenAmount * watchSell })}
            </p>
          </div>

          <div className="text-center">
            <Heading size="h4" className="mb-1 text-dog-500">
              Profits
            </Heading>
            <p className="text-3xl font-semibold">
              {currencyConverter({
                amount: tokenAmount * watchSell - watchAmount,
              })}
            </p>
          </div>

          <div className="text-center">
            <Heading size="h4" className="mb-1 text-dog-500">
              Percentage
            </Heading>
            <p className="text-3xl font-semibold">
              {calcPercentageVariance(watchAmount, tokenAmount * watchSell)}
              <span className="text-lg">%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estimator;
