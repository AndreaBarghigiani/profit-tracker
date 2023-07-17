// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import { Frequency } from "@prisma/client";
import { useRouter } from "next/router";

// Types
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import { ProjectValuesSchema, type ProjectValues } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";

const AddProject: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();
  const [useLiquidFunds, setUseLiquidFunds] = useState(false);

  const { data: userWallet, isSuccess: isUserWalletSuccess } =
    api.wallet.get.useQuery();

  const { register, handleSubmit, control, setValue, watch } =
    useForm<ProjectValues>({
      resolver: zodResolver(ProjectValuesSchema),
      defaultValues: {
        increaseFrequency: Frequency.DAILY,
        useLiquidFunds: false,
        deposit: 0,
        compound: false,
      },
    });

  const { mutate } = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.wallet.getUserStats.invalidate().then(async () => {
        // Momentarly redirect to dashboard
        // I would like to redirect to the project page
        // HINT: use prisma transation https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api
        await router.push(`/projects`);
      });
    },
  });

  const [watchDeposit] = watch(["deposit"]);

  const maxBuy =
    isUserWalletSuccess && useLiquidFunds ? userWallet?.liquidFunds : -1;
  const buttonDisabled =
    watchDeposit === 0 || (maxBuy > 0 ? watchDeposit > maxBuy : false);

  const onSubmit: SubmitHandler<ProjectValues> = (data) => {
    data.increaseFrequency = Frequency[data.increaseFrequency] as Frequency;
    mutate(data);
  };

  return (
    <main className="container mx-auto">
      <Heading size="page" gradient="gold" spacing="massive">
        Add Project
      </Heading>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            type="text"
            placeholder="My new fantastic project"
            id="name"
            {...register("name")}
          />
        </div>

        <div>
          <Label htmlFor="description">Project description</Label>
          <Textarea
            id="description"
            placeholder="Add a description if you wish"
            {...register("description")}
          />
        </div>

        <section className="flex gap-5">
          <Controller
            control={control}
            name="useLiquidFunds"
            render={() => (
              <>
                <ToggleGroup
                  type="single"
                  value={useLiquidFunds.toString()}
                  className="mt-6 flex justify-center"
                  onValueChange={(val) => {
                    setUseLiquidFunds(val === "true");
                    setValue("useLiquidFunds", val === "true");
                  }}
                >
                  <ToggleItem
                    className="disabled:cursor-not-allowed"
                    disabled={!userWallet?.liquidFunds}
                    value="true"
                  >
                    Use liquid funds
                  </ToggleItem>
                  <ToggleItem value="false">Fresh capital</ToggleItem>
                </ToggleGroup>
              </>
            )}
          />

          <div>
            <Label htmlFor="deposit">Initial Deposit</Label>
            <Input
              type="number"
              id="deposit"
              step=".01"
              {...(useLiquidFunds &&
                isUserWalletSuccess && {
                  max: userWallet?.liquidFunds,
                })}
              {...register("deposit", { valueAsNumber: true })}
            />
            {useLiquidFunds && isUserWalletSuccess ? (
              <span className="text-xs text-dog-600">
                You can only buy ~
                {currencyConverter({ amount: userWallet?.liquidFunds })}
              </span>
            ) : null}
          </div>

          <div>
            <Label htmlFor="increaseFrequency">Project frequency</Label>
            <Controller
              control={control}
              name="increaseFrequency"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Frequency..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Frequency).map((f: Frequency) => (
                      <SelectItem className="cursor-pointer" key={f} value={f}>
                        {uppercaseFirst(f)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="increaseAmount">Increase Amount</Label>
            <Input
              type="number"
              id="increaseAmount"
              step=".01"
              {...register("increaseAmount", { valueAsNumber: true })}
            />
          </div>

          <div
            className={clsx("flex items-center", {
              "self-center": useLiquidFunds,
              "mt-6": !useLiquidFunds,
            })}
          >
            <Controller
              control={control}
              name="compound"
              render={({ field }) => (
                <Switch
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                  className="mr-2"
                />
              )}
            />
            <Label htmlFor="compound">Does it compound?</Label>
          </div>
        </section>

        <Button disabled={buttonDisabled} type="submit">
          Save Project
        </Button>
      </form>
    </main>
  );
};

export default AddProject;
