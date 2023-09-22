// Utils
import { useAccount, useContractRead } from "wagmi";
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { networks } from "@unlock-protocol/networks";
import { Paywall } from "@unlock-protocol/paywall";

// Components
import Web3SignIn from "./Web3SignIn";
import { Button } from "@/components/ui/button";

// const lockAddress = "0x4025fb5018062bf3430c01ea1ff5d8b9f7fbf5a9";
const lockAddress = "0x0633A2cEfDf8EE20D791603e7dC2889Af75f5b6B";

const CheckMembership = () => {
  const paywall = new Paywall(networks);

  const { address, isConnected } = useAccount();

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
    select: (data) => {
      return Number(data) > 0;
    },
  });

  const { data: expirationTimestamp } = useContractRead({
    address: lockAddress,
    abi: PublicLockV13.abi,
    functionName: "keyExpirationTimestampFor",
    enabled: !!isConnected,
    args: address ? [address] : [],
  });

  console.log("hasAccess:", hasAccess);
  console.log("expirationTimestamp:", expirationTimestamp);

  const paywallConfig = {
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

  // Calls paywall for checkout
  const onPurchase = async () => {
    // const provider = await connector.getProvider();
    await paywall.loadCheckoutModal(paywallConfig);
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
