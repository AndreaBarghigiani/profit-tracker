// Utils
import { signIn } from "next-auth/react";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="my-10 flex h-144 w-full flex-col justify-center">
      <Heading size="page" gradient="gold">
        Track Your Crypto Investments with Precision
      </Heading>

      <Heading as="h2" size="h2" className="mb-8 text-center italic">
        Stay on top of your hodl positions and maximize your profits
      </Heading>

      <Button className="mx-auto" variant={"active"} onClick={() => signIn()}>
        Get Started
      </Button>

      <span className="my-1 text-center text-xs">Create your account NOW!</span>
    </div>
  );
};

export default HeroSection;
