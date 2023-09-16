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
    <section className="relative mx-auto mt-60 flex h-128 max-w-3xl flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="absolute top-0 z-10 h-[1px] w-full bg-gradient-to-r from-main-900 via-main-600 to-main-900 opacity-90" />
      <div className="absolute -top-1/2 h-64 w-64 rounded-full bg-main p-28 opacity-20 blur-5xl" />

      <header className="text-center">
        <Heading as="h3" size="h1" className="text-main-500">
          Ready to Take Control of Your Crypto Investments?
        </Heading>

        <Heading as="h4" size="h3" className="text-dog-500">
          Don&apos;t let your crypto investments be a guessing game.
        </Heading>
      </header>

      <p className="text-center text-dog-400">
        Join the ranks of savvy investors who use Underdog Tracker to get the
        insights they need.
        <br /> Start making confident decisions today to shape a more profitable
        crypto investment future.
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
      <div className="absolute -bottom-0 z-10 h-[1px] w-full bg-gradient-to-r from-main-900 via-main-600 to-main-900 opacity-90" />
      <div className="absolute -bottom-1/2 h-64 w-64 rounded-full bg-main p-28 opacity-20 blur-5xl" />
    </section>
  );
};

export default CTASection;
