// Utils
import { api } from "@/utils/api";
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

  const { data: hodl } = api.hodl.getByTokenId.useQuery(
    { tokenId: selectedToken?.id },
    {
      enabled: !!selectedToken?.id,
    },
  );

  const foundHodl = {
    hodlId: hodl?.id ? hodl.id : null,
    hodlAmount: hodl?.amount ? hodl.amount : null,
  };
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
            hodl={foundHodl}
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
