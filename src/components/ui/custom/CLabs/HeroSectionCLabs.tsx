// Utils
import { signIn } from "next-auth/react";
import va from "@vercel/analytics";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const HeroSectionCLabs = () => {
  return (
    <div className="my-10 flex h-144 w-full flex-col justify-center">
      <Heading size="page" gradient="gold">
        Welcome CLabs family!
      </Heading>

      <Heading
        as="h2"
        size="h2"
        className="mb-8 text-center italic text-dog-400"
      >
        So glad to have you here for our beta launch!
      </Heading>

      <Button
        className="mx-auto"
        variant={"active"}
        onClick={async () => {
          va.track("CLabs Login");
          await signIn();
        }}
      >
        Log in
      </Button>

      <span className="my-1 text-center text-xs text-dog-400">
        Create your account NOW! <br />
        (You&apos;ll need a Discord account)
      </span>
    </div>
  );
};

export default HeroSectionCLabs;
