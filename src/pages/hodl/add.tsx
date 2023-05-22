// Utils
import { z } from "zod";
import { api } from "@/utils/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyConverter } from "@/utils/string";

// Types
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AddHodlPositionForm from "@/components/addHodlPositionForm";

export const TokenSearchSchema = z.object({
  query: z.string(),
});

export type TokenSearch = z.infer<typeof TokenSearchSchema>;

const AddHodl: NextPage = () => {
  const { register: registerSearch, handleSubmit: handleSubmitSearch } =
    useForm<TokenSearch>({
      resolver: zodResolver(TokenSearchSchema),
    });
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const { data: tokens, isSuccess: isTokenSuccess } = api.token.sample.useQuery(
    undefined,
    { enabled: open }
  );
  const { data: searchResults, isSuccess: isSearchSuccess } =
    api.token.find.useQuery({ query: query }, { enabled: !!query });
  const { data: selectedToken } = api.token.get.useQuery(
    { tokenId: value },
    { enabled: !!value }
  );

  const onSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
  };

  const handleSearch: SubmitHandler<TokenSearch> = (query) => {
    setQuery(query.query);
  };

  return (
    <main className="container mx-auto">
      <Heading size="page" gradient="gold" spacing="massive">
        Add Hodl
      </Heading>

      <p className="text-center text-lg text-stone-400">
        Track your investments in crypto tokens and be sure to sell in profit!
      </p>

      <section className="mx-auto max-w-lg">
        {open ? (
          <>
            <form
              className="mb-4 flex items-center space-x-3"
              onSubmit={handleSubmitSearch(handleSearch)}
            >
              <Input
                type="text"
                placeholder="Search your token"
                {...registerSearch("query")}
              />
              <Button>Search</Button>
            </form>

            {isTokenSuccess && !isSearchSuccess ? (
              <div className="grid grid-cols-3 gap-4">
                {tokens.map((token) => (
                  <button
                    key={token.coinranking_uuid}
                    className="flex flex-col items-center justify-center rounded-lg border p-4 "
                    onClick={() => onSelect(token.coinranking_uuid)}
                  >
                    {token.iconUrl ? (
                      <Image
                        alt={token.name}
                        width={40}
                        height={40}
                        className="mb-2 h-12 w-12 rounded-full bg-slate-800 object-contain p-2"
                        src={token.iconUrl}
                      />
                    ) : null}
                    <span className="text-sm text-slate-400">{token.name}</span>
                    <span className="text-sm font-semibold text-slate-300">
                      {currencyConverter(token.latestPrice)}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {isSearchSuccess ? (
              <div className="grid grid-cols-3 gap-4">
                {searchResults.map((token) => (
                  <button
                    key={token.coinranking_uuid}
                    className="flex flex-col items-center justify-center rounded-lg border p-4 "
                    onClick={() => onSelect(token.coinranking_uuid)}
                  >
                    {token.iconUrl ? (
                      <Image
                        alt={token.name}
                        width={40}
                        height={40}
                        className="mb-2 h-12 w-12 rounded-full bg-slate-800 object-contain p-2"
                        src={token.iconUrl}
                      />
                    ) : null}
                    <span className="text-sm text-slate-400">{token.name}</span>
                    <span className="text-sm font-semibold text-slate-300">
                      {currencyConverter(token.latestPrice)}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : value && selectedToken ? (
          <>
            <h2>Token selected: {selectedToken.name}</h2>
            <p>Token value: {currencyConverter(selectedToken.latestPrice)}</p>
            <AddHodlPositionForm tokenId={selectedToken.coinranking_uuid} />
          </>
        ) : null}
      </section>
    </main>
  );
};

export default AddHodl;
