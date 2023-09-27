/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Utils
import { api } from "@/utils/api";
import { useAccount, useContractRead } from "wagmi";
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { networks } from "@unlock-protocol/networks";
import { Paywall } from "@unlock-protocol/paywall";
import { fromTimestampToDate } from "@/utils/string";
import { Role } from "@prisma/client";

// Components
import Web3SignIn from "./Web3SignIn";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// const lockAddress = "0x4025fb5018062bf3430c01ea1ff5d8b9f7fbf5a9";
const lockAddress = "0x0633A2cEfDf8EE20D791603e7dC2889Af75f5b6B";

const CheckMembership = () => {
  const paywall = new Paywall(networks);
  const { data: user } = api.user.getUser.useQuery();
  const { data: hasMembership } = api.user.hasMembership.useQuery();

  const { address, isConnected } = useAccount();
  const { mutate: updateMembership } = api.user.updateMembership.useMutation();

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

  const { data: tokenOwner } = useContractRead({
    address: lockAddress,
    abi: PublicLockV13.abi,
    functionName: "tokenOfOwnerByIndex",
    enabled: !!isConnected,
    args: address ? [address, 0] : [],
  });

  const { data: expirationTimestamp } = useContractRead({
    address: lockAddress,
    abi: PublicLockV13.abi,
    functionName: "keyExpirationTimestampFor",
    enabled: !!isConnected,
    args: [tokenOwner],
  }) as unknown as { data: number };

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

  if (hasAccess && expirationTimestamp && user?.role !== Role.SUBSCRIBER) {
    if (!hasMembership)
      updateMembership({ expirationTime: expirationTimestamp });
  }

  // Calls paywall for checkout
  const onPurchase = async () => {
    await paywall.loadCheckoutModal(paywallConfig);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Something wrong...</div>;

  return (
    <>
      <div className="mx-auto max-w-2xl">
        {!isConnected && (
          <Card button="side">
            <CardHeader>
              <Heading size="h2">Connect and check your membership</Heading>
              <p className="text-sm">
                Looks like your main wallet is not connected. Connect it now to
                buy or renew your membership.
              </p>
            </CardHeader>
            <CardContent className="ml-auto flex flex-shrink-0 pb-0">
              <Web3SignIn paywall={paywall} />
            </CardContent>
          </Card>
        )}

        {isConnected && !hasAccess && (
          <Card button="side">
            <CardHeader>
              <Heading size="h2">😱 Looks like you don&apos;t have one</Heading>
              <p className="text-sm">
                Buy it now and start to track your crypto automatically.
              </p>
            </CardHeader>
            <CardContent className="ml-auto flex flex-shrink-0 pb-0">
              <Button variant="orange" onClick={onPurchase}>
                Buy Membership
              </Button>
            </CardContent>
          </Card>
        )}

        {isConnected && expirationTimestamp && (
          <Card>
            <CardHeader>
              <Heading size="h2">Your membership will expire the:</Heading>
              <p className="text-sm">
                {fromTimestampToDate(expirationTimestamp)}
              </p>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
};

export default CheckMembership;
