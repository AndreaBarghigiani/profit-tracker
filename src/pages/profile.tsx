// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";

// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import ProfileForm from "@/components/profileForm";
import { Button } from "@/components/ui/button";

const Profile: NextPage = () => {
  const router = useRouter();

  const { data: wallet, isSuccess: isWalletSuccess } =
    api.wallet.get.useQuery();
  const { mutate } = api.user.delete.useMutation({
    onSuccess: async () => {
      await router.push(`/`);
    },
  });

  const handleDelete = () => {
    mutate();
  };

  if (!wallet) return <div>Something wrong.</div>;

  return (
    <div className="space-y-4">
      <Heading size="page" gradient="gold" spacing="massive">
        Profile
      </Heading>

      <Button variant="destructive" className="mx-auto" onClick={handleDelete}>
        Delete
      </Button>

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
