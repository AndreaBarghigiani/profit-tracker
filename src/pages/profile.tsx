// Utils
import { api } from "@/utils/api";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import ProfileForm from "@/components/profileForm";

const Profile: NextPage = () => {
  const { data: wallet, isSuccess: isWalletSuccess } =
    api.wallet.get.useQuery();

  if (!wallet) return <div>Something wrong.</div>;

  return (
    <div className="space-y-4">
      <Heading size="page" gradient="gold" spacing="massive">
        Profile
      </Heading>

      <p className="text-center">
        Here you can customize aspects of your profile, for now we let you
        update your daily goal.
      </p>

      {isWalletSuccess && (
        <ProfileForm profileData={{ dailyProfit: wallet.dailyProfit }} />
      )}
    </div>
  );
};

export default Profile;
