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
import Link from "next/link";

export const TokenSearchSchema = z.object({
  query: z.string(),
});

export type TokenSearch = z.infer<typeof TokenSearchSchema>;

const AddHodl: NextPage = () => {
  const { register: registerSearch, handleSubmit: handleSubmitSearch } =
    useForm<TokenSearch>({
      resolver: zodResolver(TokenSearchSchema),
    });
  const [query, setQuery] = useState<string>("");
  const { data: tokens, isSuccess: isTokenSuccess } =
    api.token.sample.useQuery();
  const { data: searchResults, isSuccess: isSearchSuccess } =
    api.token.find.useQuery({ query: query }, { enabled: !!query });

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
                <Link
                  key={token.coingecko_id}
                  className="flex flex-col items-center justify-center rounded-lg border p-4 "
                  href={`/hodl/create/${token.coingecko_id}`}
                >
                  {token.iconUrl ? (
                    <Image
                      alt={token.name || token.symbol || "Token"}
                      width={40}
                      height={40}
                      className="mb-2 h-12 w-12 rounded-full bg-slate-800 object-contain p-2"
                      src={token.iconUrl}
                    />
                  ) : null}
                  <span className="text-sm text-slate-400">{token.name}</span>
                  <span className="text-sm font-semibold text-slate-300">
                    {currencyConverter({ amount: token.latestPrice })}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          {isSearchSuccess ? (
            <div className="grid grid-cols-3 gap-4">
              {searchResults.map((token) => (
                <Link
                  key={token.coingecko_id}
                  className="flex flex-col items-center justify-center rounded-lg border p-4 "
                  href={`/hodl/create/${token.coingecko_id}`}
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
                    {currencyConverter({ amount: token.latestPrice })}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </>
      </section>
    </main>
  );
};

export default AddHodl;
