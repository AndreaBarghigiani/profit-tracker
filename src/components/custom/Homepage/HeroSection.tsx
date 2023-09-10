// Utils
// import { signIn } from "next-auth/react";
import va from "@vercel/analytics";

// Components
import Heading from "@/components/ui/heading";
// import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="mt-10 flex h-144 w-full flex-col justify-center">
      <Heading size="page" gradient="gold">
        Track Your Crypto Investments with Precision
      </Heading>

      <Heading
        as="h2"
        size="h2"
        className="mb-8 text-center italic text-dog-400"
      >
        Built to help you maximize your profits
      </Heading>

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

      <span className="my-1 text-center text-xs text-dog-400">
        Create your account <strong>NOW</strong>!
      </span>
    </div>
  );
};

export default HeroSection;
