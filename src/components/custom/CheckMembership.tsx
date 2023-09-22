// Utils
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { PublicLockV13 } from "@unlock-protocol/contracts";
// import { paywall } from "@/pages/_app";
import { networks } from "@unlock-protocol/networks";
import { Paywall } from "@unlock-protocol/paywall";

// Components
import Web3SignIn from "./Web3SignIn";
import { Button } from "@/components/ui/button";

const lockAddress = "0x4025fb5018062bf3430c01ea1ff5d8b9f7fbf5a9";

const CheckMembership = () => {
  const { address, isConnected, connector } = useAccount();
  const paywall = new Paywall(networks);

  // Check if has membership
  const {
    data: hasAccess,
    isError,
    isLoading,
  } = useContractRead({
    address: lockAddress,
    abi: PublicLockV13.abi,
    chainId: 137,
    functionName: "balanceOf",
    enabled: !!isConnected,
    watch: true,
    args: address ? [address] : [],
    // select: (data) => {
    //   return Number(data) > 0;
    // },
  });

  const downloadedPaywallConfig = {
    icon: "https://storage.unlock-protocol.com/0c09266c-7067-448c-9ca4-6d2120cbd072",
    locks: {
      [lockAddress]: {
        network: 137,
        skipRecipient: true,
        recurringPayments: 12,
      },
    },
    pessimistic: true,
    skipRecipient: true,
    title: "Underdog Tracker Membership",
  };
  // const paywallConfig = {
  //   locks: {
  //     [lockAddress]: {
  //       network: 137,
  //       name: "Underdog Tracker Membership",
  //     },
  //     pessimistic: true,
  //     skipReceipient: true,
  //   },
  // };

  // Calls paywall for checkout
  const onPurchase = async () => {
    // const provider = await connector.getProvider();
    const result = await paywall.loadCheckoutModal(downloadedPaywallConfig);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Something wrong...</div>;

  return (
    <>
      {!isConnected && (
        <div className="mx-auto max-w-2xl">
          <p>You are not connected...</p>
          <Web3SignIn paywall={paywall} />
        </div>
      )}

      {/* {isConnected && !hasAccess && ( */}
      {isConnected && (
        <div>
          <div>buy one</div>
          <Button variant="orange" onClick={onPurchase}>
            Buy Membership
          </Button>
        </div>
      )}
    </>
  );
};

export default CheckMembership;
