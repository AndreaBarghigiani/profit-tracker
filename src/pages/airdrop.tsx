// Utils
import { useState } from "react";

// Types
import type { NextPage } from "next";
import type { Token } from "@prisma/client";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import TokenSearchInput from "@/components/ui/custom/TokenSearchInput";
import AddHodlPositionForm from "@/components/ui/custom/AddHodlPositionForm";

const Airdrop: NextPage = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  return (
    <>
      <Head>
        <title>Airdrop - Underdog Tracker</title>
      </Head>

      <div>
        <Heading size="page" gradient="gold" spacing="massive">
          Airdrop
        </Heading>

        <section className="text-center">
          <Heading size="h2" className="text-dog-200">
            Congratulations 🎉
          </Heading>

          <p className="text-dog-400">
            Congratulations, looks like you earned an airdrop. Use the form
            below to record the new entry in your wallet.
          </p>
          <p className="text-sm text-dog-500">
            <strong>
              <em>Note:</em>
            </strong>{" "}
            as an airdrop the $ evaluation of the tokens will not be added to
            your exposure!
          </p>
        </section>

        <div className="mx-auto my-10 w-2/3 text-center">
          <p className="mx-auto w-3/6 text-xs text-dog-500">
            For now you can only select CoinGecko traked tokens or custom ones
            already tracked by the system. More will be added...
          </p>

          <TokenSearchInput
            selectedToken={selectedToken}
            onTokenSelection={setSelectedToken}
          />
        </div>
        {!!selectedToken && (
          <div className="mx-auto my-10 w-2/3">
            <AddHodlPositionForm hodlId={null} token={selectedToken} airdrop />
          </div>
        )}
      </div>
    </>
  );
};

export default Airdrop;
