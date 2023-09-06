// Utils

// Components
import Heading from "@/components/ui/heading";

const SolutionSection = () => {
  return (
    <section className="mx-auto my-20  flex max-w-3xl flex-col items-center justify-center gap-6">
      <Heading as="h3" size="h2" className=" text-main-500">
        The Challenge: Navigating Crypto Investment Complexity
      </Heading>

      <p className="text-center text-dog-400">
        As a crypto investor, you know the challenge of keeping tabs on your
        multiple hodl positions and understanding the true profitability of your
        investments. With the fast-paced nature of the crypto market and the
        complexity of various decentralized applications, managing your
        portfolio effectively can be overwhelming. That&apos;s where Underdog
        Tracker steps in to simplify your journey.
      </p>
    </section>
  );
};

export default SolutionSection;
