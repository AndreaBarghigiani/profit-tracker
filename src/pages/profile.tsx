// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";

// Types
import type { NextPage } from "next";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import ProfileForm from "@/components/profileForm";
import CheckMembership from "@/components/custom/CheckMembership";
import WalletAddress from "@/components/custom/Profile/WalletAddress";
import { Button } from "@/components/ui/button";

const Profile: NextPage = () => {
  const router = useRouter();

  const { data: wallet, isSuccess: isWalletSuccess } =
    api.wallet.get.useQuery();
  const { data: userWallets, isSuccess: isUserWalletsSuccess } =
    api.userWallets.getAll.useQuery();
  const { mutate: deleteUser } = api.user.delete.useMutation({
    onSuccess: async () => {
      await router.push(`/`);
    },
  });

  const handleDelete = () => {
    deleteUser();
  };

  if (!wallet) return <div>Something wrong.</div>;

  return (
    <>
      <Head>
        <title>Profile - Underdog Tracker</title>
      </Head>

      <div className="mx-auto max-w-2xl space-y-4">
        <Heading size="page" gradient="gold" spacing="massive">
          Profile
        </Heading>

        <p className="text-center">
          Here you can customize aspects of your profile, for now we let you
          update your daily goal.
        </p>

        {/* <Web3SignIn /> */}

        <CheckMembership />

        {isUserWalletsSuccess && userWallets.length > 0 && (
          <>
            <Heading size="h3">Your DeFi Wallets</Heading>
            <ul>
              {userWallets.map((wallet) => (
                <WalletAddress key={wallet.id} userWallet={wallet} />
              ))}
            </ul>
          </>
        )}

        <div className="mx-auto max-w-3xl">
          {isWalletSuccess && (
            <ProfileForm profileData={{ dailyProfit: wallet.dailyProfit }} />
          )}
          <footer className="flex">
            <Button
              variant="ghost-danger"
              className="ml-auto mt-4"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Profile;
