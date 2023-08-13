// Utils
import { api } from "@/utils/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Components
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AddCustomTokenFormSchema = z.object({
  address: z.string(),
});

const AddCustomTokenForm = () => {
  const form = useForm<z.infer<typeof AddCustomTokenFormSchema>>({
    resolver: zodResolver(AddCustomTokenFormSchema),
    defaultValues: {
      address: "",
    },
  });

  const [query, setQuery] = useState("");

  const { data: token, isFetching: isTokenFetching } =
    api.token.searchDex.useQuery(
      { query },
      {
        enabled: !!query,
        refetchOnWindowFocus: false,
      },
    );

  const onSubmit = (values: z.infer<typeof AddCustomTokenFormSchema>) => {
    setQuery(values.address);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex items-end gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

          <Button type="submit" disabled={isTokenFetching}>
            {isTokenFetching ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Token
              </>
            )}
          </Button>
        </form>
      </Form>

      {!!token && (
        <div className="my-10">
          <Heading className="text-main-500">
            {token.name} <span className="text-sm">[{token.symbol}]</span>
          </Heading>

          <AddHodlPositionForm hodlId={null} token={token} />
        </div>
      )}
    </div>
  );
};

export default AddCustomTokenForm;
