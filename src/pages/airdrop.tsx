// Utils

// Types
import type { NextPage } from "next";

// Components
import Head from "next/head";
import Heading from "@/components/ui/heading";
import AddAirdropForm from "@/components/custom/AddAirdropForm";

const Airdrop: NextPage = () => {
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
            as an airdrop the $ valuation of the tokens will not be added to
            your exposure!
          </p>
        </section>

        <div className="mx-auto my-10 w-2/3 space-y-10 text-center">
          <AddAirdropForm />
        </div>
      </div>
    </>
  );
};

export default Airdrop;
