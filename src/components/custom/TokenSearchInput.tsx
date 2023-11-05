// Utils
import { api } from "@/utils/api";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// Types
import type { Token } from "@prisma/client";

// Components
import Image from "next/image";
import { ChevronsUpDown, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TokenSearchInput = ({
  selectedToken,
  onTokenSelection,
}: {
  selectedToken: Token | null;
  onTokenSelection: (token: Token) => void;
}) => {
  const [open, setOpen] = useState(false);
  // const [token, setToken] = useState<Token | null>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500).toString();

  const {
    data: tokens,
    isSuccess: isTokensSuccess,
    isFetching: isTokensLoading,
    remove: removeTokens,
  } = api.token.sample.useQuery(undefined, {
    enabled: !debouncedQuery || open,
  });

  const {
    data: searchResults,
    isSuccess: isSearchSuccess,
    isFetching: isSearchLoading,
  } = api.token.find.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery && open },
  );

  const handleSearch = (search: string) => {
    removeTokens();
    setQuery(search);
  };

  const handleSelection = (value: string, data: Token[]) => {
    const selectedToken =
      data.find(
        (token) => token.coingecko_id.toLowerCase() === value.toLowerCase(),
      ) || null;
    onTokenSelection(selectedToken as Token);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mx-auto mt-2 flex w-[200px] items-center justify-start border-dog-600"
          >
            {selectedToken && (
              <Image
                src={selectedToken.iconUrl ?? "/placeholder.png"}
                alt={
                  selectedToken.custom
                    ? `${selectedToken.name} [Custom]`
                    : `${selectedToken.name} [${selectedToken.symbol}]`
                }
                className="mr-2 flex-shrink-0 rounded-full"
                width={16}
                height={16}
              />
            )}
            <p className="-mt-0.5 truncate">
              {selectedToken
                ? selectedToken.custom
                  ? `${selectedToken.name} [Custom]`
                  : `${
                      selectedToken.name
                    } [${selectedToken.symbol.toUpperCase()}]`
                : "Select a token"}
            </p>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] border-dog-600 bg-dog-800 p-0">
          <Command shouldFilter={false} loop>
            <CommandInput
              onValueChange={(search) => handleSearch(search)}
              placeholder="Search for a token"
            />
            <CommandList className="border-dog-600 bg-dog-850">
              {isTokensLoading || isSearchLoading ? (
                <CommandLoading>
                  <div className="flex items-center p-3 text-sm text-dog-300">
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Fetching tokens...
                  </div>
                </CommandLoading>
              ) : (
                <>
                  <CommandEmpty>No token found...</CommandEmpty>
                  <CommandGroup>
                    {isTokensSuccess &&
                      !isSearchSuccess &&
                      !isSearchLoading &&
                      tokens.map((token) => (
                        <CommandItem
                          key={token.coingecko_id}
                          value={token.coingecko_id}
                          className="group"
                          onSelect={(value) => {
                            handleSelection(value, tokens);
                          }}
                        >
                          <Image
                            src={token.iconUrl ?? "/placeholder.png"}
                            alt={token.name}
                            className="mr-4 flex-shrink-0 rounded-full group-hover:bg-dog-800 group-aria-selected:bg-dog-800"
                            width={18}
                            height={18}
                          />
                          <p className="flex gap-2">
                            <span className="truncate">{token.name}</span>{" "}
                            <span className="ml-2 text-xs text-dog-500 group-hover:text-dog-800 group-aria-selected:text-dog-800">
                              [{token.symbol.toUpperCase()}]
                            </span>
                          </p>
                        </CommandItem>
                      ))}

                    {isSearchSuccess &&
                      searchResults.map((token) => (
                        <CommandItem
                          key={token.coingecko_id}
                          value={token.coingecko_id}
                          className="group"
                          onSelect={(value) => {
                            handleSelection(value, searchResults);
                          }}
                        >
                          <Image
                            src={token.iconUrl ?? "/placeholder.png"}
                            alt={token.name}
                            className="mr-4 flex-shrink-0 rounded-full group-hover:bg-dog-800 group-aria-selected:bg-dog-800"
                            width={18}
                            height={18}
                          />
                          <p className="flex max-w-[140px] items-center gap-2">
                            <span className="truncate">{token.name}</span>{" "}
                            <span className="ml-2 text-xs text-dog-500 group-hover:text-dog-800 group-aria-selected:text-dog-800">
                              [{token.symbol.toUpperCase()}]
                            </span>
                          </p>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TokenSearchInput;
