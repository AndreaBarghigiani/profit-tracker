/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Utils
import { api } from "@/utils/api";
import { useMemo } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// Types
import type { Paywall } from "@unlock-protocol/paywall";

// Components
import { Button } from "@/components/ui/button";

const Web3SignIn = ({ paywall }: { paywall: Paywall }) => {
  const utils = api.useContext();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address } = useAccount();

  const { data: userWallets } = api.userWallets.getAll.useQuery();
  const { mutate: createUserWallet } = api.userWallets.create.useMutation({
    onSuccess: async () => {
      await utils.userWallets.getAll.invalidate();
    },
  });

  const provider = useMemo(() => {
    return paywall.getProvider("https://app.unlock-protocol.com", {
      clientId: "http://localhost:3000/profile",
    });
  }, [paywall]);

  const { connect } = useConnect({
    connector: new InjectedConnector({
      options: {
        name: "Unlock Underdog Tracker",
        getProvider: () => provider,
      },
    }),
  });

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
      return;
    }

    connect();

    // Skip if wallet already exists
    if (
      address !== undefined &&
      userWallets?.some((wallet) => wallet.walletAddress !== address)
    ) {
      createUserWallet({ walletAddress: address });
    }
  };

  return (
    <Button variant="active" className="mx-auto" onClick={handleAuth}>
      {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  );
};

export default Web3SignIn;
