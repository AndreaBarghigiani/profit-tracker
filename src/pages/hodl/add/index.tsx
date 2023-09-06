// Utils
import { z } from "zod";
import { api } from "@/utils/api";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prisma } from "@/server/db";
import { getSample as getTokenSamples } from "@/server/api/routers/token";

// Types
import type { NextPage, InferGetServerSidePropsType } from "next";
import type { SubmitHandler } from "react-hook-form";
import type { TokenWithoutDates } from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HodlRow from "@/components/custom/HodlRow";
import { Search, RefreshCcw, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export const TokenSearchSchema = z.object({
  query: z.string(),
});

export type TokenSearch = z.infer<typeof TokenSearchSchema>;

const AddHodl: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tokens }) => {
  const { register: registerSearch, handleSubmit: handleSubmitSearch } =
    useForm<TokenSearch>({
      resolver: zodResolver(TokenSearchSchema),
    });
  const [query, setQuery] = useState("");
  const {
    data: searchResults,
    isSuccess: isSearchSuccess,
    isFetching: isSearchLoading,
  } = api.token.find.useQuery({ query: query }, { enabled: !!query });

  const handleSearch: SubmitHandler<TokenSearch> = (query) => {
    setQuery(query.query);
  };

  const iconClasses = clsx("w-4 h-4", {
    "animate-spin": isSearchLoading,
  });

  return (
    <main className="container mx-auto">
      <Heading size="page" gradient="gold" spacing="massive">
        Add Hodl
      </Heading>

      <p className="text-center text-lg text-stone-400">
        Track your investments in crypto tokens and be sure to sell in profit!
      </p>

      <section className="mx-auto my-4 max-w-lg rounded border border-dog-700 bg-dog-800 p-4 pb-2">
        <>
          <form
            className="mb-2 flex items-center space-x-3"
            onSubmit={handleSubmitSearch(handleSearch)}
          >
            <Input
              type="text"
              placeholder="Search your token"
              {...registerSearch("query")}
            />
            <Button disabled={isSearchLoading}>
              {isSearchLoading ? (
                <RefreshCcw className={iconClasses} />
              ) : (
                <Search className={iconClasses} />
              )}
            </Button>
          </form>

          {isSearchSuccess && searchResults.length === 0 && (
            <p className="text-center text-xs text-dog-400">
              No results found. Please search again.
            </p>
          )}

          <ul className="mt-2">
            {isSearchSuccess && searchResults.length > 0
              ? searchResults.map((token) => (
                  <HodlRow key={token.coingecko_id} token={token} />
                ))
              : tokens.map((token) => (
                  <HodlRow key={token.coingecko_id} token={token} />
                ))}

            <Separator className="my-2 bg-dog-750" />

            <li className=" rounded-md border-dog-400 px-3 py-2 text-dog-400 hover:bg-main-900">
              <Link className="flex items-center" href={`/hodl/create/custom`}>
                <Image
                  alt={"Custom Token"}
                  width={40}
                  height={40}
                  className="mr-2 h-8 w-8 rounded-full bg-dog-800 object-contain"
                  src={"/placeholder.png"}
                />
                <span className="mr-2 font-semibold text-dog-300">
                  Add your custom token
                </span>
                <span className="mr-2 text-xs">[Custom]</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Link>
            </li>
          </ul>
        </>
      </section>
    </main>
  );
};

export default AddHodl;

export async function getServerSideProps() {
  const tokens: TokenWithoutDates[] = await getTokenSamples({ prisma });

  const massaged: TokenWithoutDates[] = tokens.map((token) => {
    delete token.createdAt;
    delete token.updatedAt;

    return token;
  });
  return {
    props: {
      tokens: massaged,
    },
  };
}
