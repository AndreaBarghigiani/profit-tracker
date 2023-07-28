// Utils
import { api } from "@/utils/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { currencyConverter, uppercaseFirst } from "@/utils/string";
import clsx from "clsx";

import { TransactionType } from "@prisma/client";
import { HodlTransactionSchema } from "@/server/types";
import { useRouter } from "next/router";

// Types
import type { SubmitHandler } from "react-hook-form";
import type { TokenWithoutDates, HodlTransaction } from "@/server/types";
import type { Token } from "@prisma/client";

// Components
import { Button } from "../button";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

const AddCustomTokenFormSchema = z.object({
  address: z.string().min(42).max(42),
});

const AddCustomTokenForm = () => {
  const form = useForm<z.infer<typeof AddCustomTokenFormSchema>>({
    resolver: zodResolver(AddCustomTokenFormSchema),
    defaultValues: {
      address: "",
    },
  });

  const [query, setQuery] = useState("");

  const { data: token, isLoading: isTokensLoading } =
    api.token.searchDex.useQuery(
      { query },
      {
        enabled: !!query,
        refetchOnWindowFocus: false,
      },
    );

  console.log("token", token);

  const onSubmit = (values: z.infer<typeof AddCustomTokenFormSchema>) => {
    setQuery(values.address);
  };

  return (
    <div>
      <Form {...form}>
        <form className="flex items-end" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-4/6">
                <FormLabel htmlFor="address">Address</FormLabel>
                <Input {...field} placeholder="Add Token Address" />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="ml-auto" type="submit">
            Search Token
          </Button>
        </form>
      </Form>

      {!!token && (
        <div>
          <AddHodlPositionForm hodlId={null} token={token} />
        </div>
      )}
    </div>
  );
};

export default AddCustomTokenForm;
