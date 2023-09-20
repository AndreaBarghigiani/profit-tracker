// Utils
import { api } from "@/utils/api";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

// Components
import { Button } from "@/components/ui/button";

const Web3SignIn = () => {
  const utils = api.useContext();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { data: userWallets } = api.userWallets.getAll.useQuery();
  const { mutate: createUserWallet } = api.userWallets.create.useMutation({
    onSuccess: async () => {
      await utils.userWallets.getAll.invalidate();
    },
  });

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
      return;
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const userData = { address: account, chainId: chain.id };

    if (
      // Skip if wallet already exists
      userWallets?.some((wallet) => wallet.walletAddress === userData.address)
    )
      return;
    createUserWallet({ walletAddress: userData.address });
  };

  return (
    <Button variant="active" className="mx-auto" onClick={handleAuth}>
      {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  );
};

export default Web3SignIn;
