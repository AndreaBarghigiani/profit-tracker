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
import Head from "next/head";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TokenSearchInput from "@/components/custom/TokenSearchInput";
import DollarInput from "@/components/custom/DollarInput";

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
    },
  });

  const [watchAmount, watchEstimate, watchSell] = form.watch([
    "amount",
    "estimate",
    "sell",
  ]);

  const tokenAmount = watchAmount / watchEstimate;
  const profit = tokenAmount * watchSell - watchAmount;

  useEffect(() => {
    if (!selectedToken) return;

    form.setValue("estimate", selectedToken.latestPrice);
    form.setValue("sell", selectedToken.latestPrice);

    setCurStep(2);
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
    <>
      <Head>
        <title>Estimate your profits - Underdog Tracker</title>
      </Head>
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
                      render={() => (
                        <FormItem>
                          <FormLabel>At what price?</FormLabel>
                          <FormControl>
                            <Input
                              {...form.register("estimate", {
                                valueAsNumber: true,
                              })}
                              step="any"
                              type="number"
                            />
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
                      disabled={watchAmount <= 0}
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
                    <p className="flex w-full pr-5 text-xl text-dog-500">
                      <span className="mr-3 block truncate">{tokenAmount}</span>{" "}
                      {selectedToken?.symbol.toUpperCase()}
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
                              {...form.register("sell", {
                                valueAsNumber: true,
                              })}
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
                You will {profit > 0 ? "profit" : "lose"}
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
                    {profit > 0 ? "Profits" : "Losses"}
                  </Heading>
                  <p className="text-3xl font-semibold">
                    {currencyConverter({
                      amount: profit,
                      showSign: profit < 0,
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <Heading size="h4" className="mb-1 text-dog-500">
                    Percentage
                  </Heading>
                  <p className="text-3xl font-semibold">
                    {calcPercentageVariance(
                      watchAmount,
                      tokenAmount * watchSell,
                    )}
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
    </>
  );
};

export default Estimator;
