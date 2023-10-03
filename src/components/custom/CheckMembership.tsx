/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// Utils
import { api } from "@/utils/api";
import { useAccount, useContractRead } from "wagmi";
import { PublicLockV13 } from "@unlock-protocol/contracts";
import networks from "@unlock-protocol/networks";
import { Paywall } from "@unlock-protocol/paywall";
import { fromTimestampToDate } from "@/utils/string";
import { Role } from "@prisma/client";

// Components
import Web3SignIn from "./Web3SignIn";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const paywall = new Paywall(networks);

// Official Contract
const lockAddress = "0x4025fb5018062bf3430c01ea1ff5d8b9f7fbf5a9";

// Test Contract
// const lockAddress = "0x0633A2cEfDf8EE20D791603e7dC2889Af75f5b6B";

const CheckMembership = () => {
  const { data: user } = api.user.getUser.useQuery();
  const { data: hasMembership } = api.user.hasMembership.useQuery();

  const { address, isConnected, connector } = useAccount();
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
    enabled: !!isConnected && !!hasAccess,
    args: address ? [address, 0] : [],
  });

  const { data: expirationTimestamp } = useContractRead({
    address: lockAddress,
    abi: PublicLockV13.abi,
    functionName: "keyExpirationTimestampFor",
    enabled: !!isConnected && !!hasAccess,
    args: [tokenOwner],
  }) as unknown as { data: number };

  if (
    hasAccess && // from wallet, holds the NFT
    expirationTimestamp &&
    user?.role !== Role.SUBSCRIBER &&
    !hasMembership // from db, has the membership date stored
  ) {
    updateMembership({ expirationTime: expirationTimestamp });
  }

  // Calls paywall for checkout
  const onPurchase = async () => {
    if (connector) {
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
        referrer: "0x7b3fc8884f69a30bea47013961e06c54fc003ad3",
        title: "Underdog Tracker Membership",
      };

      await paywall.connect(await connector.getProvider());
      await paywall.loadCheckoutModal(paywallConfig);
    }

    return false;
  };

  let content = {
    title: "",
    body: "",
  };

  if (!isConnected) {
    content = {
      title: "Connect and check your membership",
      body: "Looks like your main wallet is not connected. Connect it now to buy or renew your membership.",
    };
  }

  if (isConnected && !hasAccess) {
    content = {
      title: "😱 Looks like you don't have one",
      body: "Buy it now and start to track your crypto automatically.",
    };
  }

  if (isConnected && expirationTimestamp) {
    content = {
      title: "Your membership will expire the:",
      body: fromTimestampToDate(expirationTimestamp),
    };
  }

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Something wrong...</div>;

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <Card button="side">
          <CardHeader>
            <Heading size="h2">{content.title}</Heading>
            <p className="text-sm">{content.body}</p>
          </CardHeader>

          <CardContent className="ml-auto flex flex-shrink-0 flex-col gap-y-2 pb-0">
            <Web3SignIn />

            {isConnected && !hasAccess && (
              <Button variant="orange" onClick={onPurchase}>
                Buy Membership
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CheckMembership;
