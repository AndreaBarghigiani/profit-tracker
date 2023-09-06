// Utils
// import { signIn } from "next-auth/react";
import va from "@vercel/analytics";

// Components
import Heading from "@/components/ui/heading";
// import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="mx-auto my-20  flex max-w-3xl flex-col items-center justify-center gap-6">
      <Heading as="h3" size="h2" className=" text-main-500">
        Ready to Take Control of Your Crypto Investments?
      </Heading>

      <p className="text-center text-dog-400">
        Don&apos;t let your crypto investments be a guessing game. Join the
        ranks of savvy investors who trust Underdog Tracker to provide them with
        the insights they need. Start making confident decisions today to shape
        a more profitable crypto investment future.
      </p>

      {/* <Button className="mx-auto" variant={"active"} onClick={() => signIn()}>
        Get Started
      </Button> */}

      <Link
        className={buttonVariants({
          variant: "active",
          className: "mx-auto flex items-center",
        })}
        href="/get-started"
        onClick={() => {
          va.track("Homepage Get Started");
        }}
      >
        Get Started
      </Link>
    </section>
  );
};

export default CTASection;
