// Utils

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";

const ProblemSection = () => {
  return (
    <section className="mx-auto my-20 grid max-w-3xl grid-cols-3  items-center gap-6">
      <div className="col-span-2">
        <Heading as="h3" size="h2" className=" text-main-500">
          The Challenge: Navigating Crypto Investment Complexity
        </Heading>

        <p className="text-dog-400">
          As a crypto investor, you know the challenge of keeping tabs on your
          multiple hodl positions and understanding the true profitability of
          your investments. With the fast-paced nature of the crypto market and
          the complexity of various decentralized applications, managing your
          portfolio effectively can be overwhelming. That&apos;s where Underdog
          Tracker steps in to simplify your journey.
        </p>
      </div>

      <Image
        src="/people-talking-crypto.jpg"
        alt="People talking crypto to solve the challenge of navigating crypto investment complexity"
        className="rounded-full border-4 border-main-500 shadow-inner"
        width={200}
        height={200}
      />
    </section>
  );
};

export default ProblemSection;
