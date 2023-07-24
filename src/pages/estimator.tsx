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
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TokenSearchInput from "@/components/ui/custom/TokenSearchInput";
import DollarInput from "@/components/ui/custom/DollarInput";

const formSchema = z.object({
  amount: z.number().positive(),
  estimate: z.number().positive(),
  sell: z.number().positive(),
});

const Estimator = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [curStep, setCurStep] = useState(1);

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

  const tokenAmount = watchAmount / watchEstimate;

  useEffect(() => {
    if (!selectedToken) return;
    setCurStep(2);
    form.setValue("estimate", selectedToken.latestPrice);
  }, [selectedToken, form]);

  const setSellPriceStep = () => {
    setCurStep(3);
  };

  const onSubmit = () => {
    setCurStep(4);
  };

  const handleReset = () => {
    setCurStep(1);
    setSelectedToken(null);
    form.reset();
  };

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        How much can you profit?
      </Heading>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mb-8 max-w-4xl space-y-8"
        >
          <div>
            <div className="mx-auto max-w-xl">
              <p className="mb-4 text-center">
                Everything start with a token. Select the one you&apos;re
                betting on.
              </p>
              <TokenSearchInput
                selectedToken={selectedToken}
                onTokenSelection={setSelectedToken}
              />
            </div>

            {curStep > 1 && (
              <>
                <div className="my-5 grid grid-cols-2 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <DollarInput
                        label="Amount"
                        placeholder="100.00"
                        setValue={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>At what price?</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {curStep === 2 && (
                  <Button
                    className="mx-auto flex"
                    type="button"
                    onClick={setSellPriceStep}
                  >
                    Set sell price
                  </Button>
                )}
              </>
            )}

            {curStep > 2 && (
              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <Heading size="h3">You bought</Heading>
                  <p className="text-xl text-dog-500">
                    {tokenAmount} {selectedToken?.symbol.toUpperCase()}
                  </p>
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="sell"
                    render={() => (
                      <FormItem>
                        <FormLabel>At which price should we sell?</FormLabel>
                        <FormControl>
                          <Input
                            // {...field}
                            {...form.register("sell", { valueAsNumber: true })}
                            step="any"
                            placeholder={watchEstimate.toString()}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          {curStep === 3 && (
            <Button className="mx-auto flex" type="submit">
              Estimate
            </Button>
          )}
        </form>
      </Form>

      {curStep > 3 && (
        <>
          <div className="mx-auto mb-6 w-fit rounded-lg border border-dog-750 bg-dog-850 px-2 py-5">
            <Heading size="h1" className="mt-0 text-center">
              You will profit
            </Heading>

            <div className="grid grid-cols-3 justify-around gap-6 px-3">
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
          <Button
            className="mx-auto flex"
            size="lg"
            variant="active"
            onClick={handleReset}
          >
            Restart
          </Button>
        </>
      )}
    </div>
  );
};

export default Estimator;
