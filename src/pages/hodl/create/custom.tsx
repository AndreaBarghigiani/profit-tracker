// Utils

// Types

// Components
import AddCustomTokenForm from "@/components/ui/custom/AddCustomTokenForm";
import Heading from "@/components/ui/heading";

const AddHodlPosition = () => {
  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Custom Token
      </Heading>

      <section className="mx-auto max-w-4xl space-y-2 text-center text-dog-300">
        <p>
          We would like to track &apos;em all but we&apos;re using the great{" "}
          <a
            className="underline"
            href="https://www.coingecko.com/"
            target="_blank"
          >
            CoinGecko API
          </a>
          , that gives us a limited set of results.
        </p>
        <p>
          So if you want to track a token that is not on CoinGecko, you can add
          it here via it&apos;s address, and we will leverage the powerful APIs
          of DexScreener.
        </p>
        <p>
          If DexScreener is able to track the token, you can bet we will too.
        </p>
      </section>

      <div className="mx-auto w-2/3">
        <AddCustomTokenForm />
      </div>
    </div>
  );
};

export default AddHodlPosition;
