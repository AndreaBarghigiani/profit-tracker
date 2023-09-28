// Utils
import { api } from "@/utils/api";

// Components
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Types
import type { UserWallet } from "@prisma/client";

const WalletAddress = ({ userWallet }: { userWallet: UserWallet }) => {
  const utils = api.useContext();

  const { mutate: deleteUserWallet } = api.userWallets.delete.useMutation({
    onSuccess: async () => {
      await utils.userWallets.getAll.invalidate();
    },
  });

  const handleDelete = () => {
    deleteUserWallet({ walletId: userWallet.id });
  };

  return (
    <li className="flex items-center gap-x-3">
      <span>{userWallet.walletAddress}</span>
      <Button variant="ghost-danger" size="sm" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};

export default WalletAddress;
