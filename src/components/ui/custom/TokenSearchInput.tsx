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
  onTokenSelection,
}: {
  onTokenSelection: (token: Token) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<Token | null>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const {
    data: tokens,
    isSuccess: isTokensSuccess,
    isFetching: isTokensLoading,
    remove: removeTokens,
  } = api.token.sample.useQuery(undefined, { enabled: !debouncedQuery });

  const {
    data: searchResults,
    isSuccess: isSearchSuccess,
    isFetching: isSearchLoading,
  } = api.token.search.useQuery(
    { query: debouncedQuery },
    { enabled: !!debouncedQuery },
  );

  const handleSearch = (search: string) => {
    removeTokens();
    setQuery(search);
  };

  const handleSelection = (value: string, data: Token[]) => {
    const selectedToken =
      data.find((token) => token.coingecko_id === value) || null;
    onTokenSelection(selectedToken as Token);
    setToken(selectedToken);
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
            className="mt-2 w-[200px] items-center justify-start border-dog-600"
          >
            {!!token?.iconUrl && (
              <Image
                src={token.iconUrl}
                alt={token.name}
                className="mr-2 flex-shrink-0 rounded-full"
                width={16}
                height={16}
              />
            )}
            <p className="-mt-0.5 truncate">
              {token ? token.name : "Select a token"}
            </p>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false} loop>
            <CommandInput
              onValueChange={(search) => handleSearch(search)}
              placeholder="Search for a token"
            />
            <CommandList>
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
                      tokens.map((token) => (
                        <CommandItem
                          key={token.coingecko_id}
                          value={token.coingecko_id}
                          onSelect={(value) => {
                            handleSelection(value, tokens);
                          }}
                        >
                          {!!token.iconUrl && (
                            <Image
                              src={token.iconUrl}
                              alt={token.name}
                              className="mr-4 flex-shrink-0 rounded-full"
                              width={18}
                              height={18}
                            />
                          )}
                          {token.name}
                        </CommandItem>
                      ))}

                    {isSearchSuccess &&
                      searchResults.map((token) => (
                        <CommandItem
                          key={token.coingecko_id}
                          value={token.coingecko_id}
                          onSelect={(value) => {
                            handleSelection(value, searchResults);
                          }}
                        >
                          {!!token.iconUrl && (
                            <Image
                              src={token.iconUrl}
                              alt={token.name}
                              className="mr-4 flex-shrink-0 rounded-full"
                              width={18}
                              height={18}
                            />
                          )}
                          {token.name}
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
