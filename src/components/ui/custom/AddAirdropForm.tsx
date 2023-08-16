// Utils
import { useState } from "react";

// Types
import type { Token } from "@prisma/client";
// Components
import TokenSearchInput from "@/components/ui/custom/TokenSearchInput";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";

const AddAirdropForm = ({
  closeModal,
}: {
  closeModal?: () => void | Promise<void>;
}) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  return (
    <>
      <div>
        <p className="mx-auto w-4/6 text-center text-xs text-dog-500">
          For now you can only select CoinGecko traked tokens or custom ones
          already tracked by the system. More will be added...
        </p>

        <TokenSearchInput
          selectedToken={selectedToken}
          onTokenSelection={setSelectedToken}
        />
      </div>
      {!!selectedToken && (
        <div className="text-left">
          <AddHodlPositionForm
            hodlId={null}
            token={selectedToken}
            closeModal={closeModal}
            airdrop
          />
        </div>
      )}
    </>
  );
};

export default AddAirdropForm;
