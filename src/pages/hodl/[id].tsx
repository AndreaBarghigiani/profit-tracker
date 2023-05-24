// Utils
import { useRouter } from "next/router";

// Types
import type { NextPage } from "next";
import Heading from "@/components/ui/heading";

// Components

const Hodl: NextPage = () => {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          Check your position
        </Heading>
      </header>
    </div>
  );
};

export default Hodl;
