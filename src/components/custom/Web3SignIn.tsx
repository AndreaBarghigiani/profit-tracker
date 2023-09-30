/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Utils
import { api } from "@/utils/api";
import clsx from "clsx";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// Types
import type { WalletAddress } from "@/server/types";

// Components
import { Button } from "@/components/ui/button";
import { RefreshCcw, Plug2, Wallet } from "lucide-react";

const Web3SignIn = () => {
  const utils = api.useContext();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address } = useAccount();

  const { data: walletPresent, isSuccess: isWalletPresentSuccess } =
    api.userWallets.get.useQuery(
      { walletAddress: address as WalletAddress },
      { enabled: !!address },
    );

  const { mutate: createUserWallet, isLoading: isCreateUserWalletLoading } =
    api.userWallets.create.useMutation({
      onSuccess: async () => {
        await utils.userWallets.getAll.invalidate();
      },
    });

  const { connect, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
      return;
    }

    connect();
  };

  if (
    address !== undefined &&
    isWalletPresentSuccess &&
    !walletPresent &&
    !isCreateUserWalletLoading
  ) {
    createUserWallet({ walletAddress: address });
  }

  return (
    <Button
      variant="active"
      disabled={isLoading}
      className="mx-auto"
      onClick={handleAuth}
    >
      {isLoading ? (
        <>
          <RefreshCcw
            className={clsx("mr-2 h-4 w-4", {
              "animate-spin": isLoading,
            })}
          />
          Connect Wallet
        </>
      ) : isConnected ? (
        <>
          <Plug2 className="mr-2 h-4 w-4 -rotate-90" />
          Disconnect Wallet
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default Web3SignIn;
