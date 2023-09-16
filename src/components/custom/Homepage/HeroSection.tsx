// Utils
// import { signIn } from "next-auth/react";
import { useRef } from "react";
import va from "@vercel/analytics";
import { useScroll, useTransform, motion } from "framer-motion";

// Components
// import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const marginTop = useTransform(scrollYProgress, [0, 0.5], [-50, -200]);

  return (
    <motion.div
      style={{ opacity, scale, marginTop }}
      ref={targetRef}
      className="flex h-screen w-full flex-col justify-center"
    >
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
    </motion.div>
  );
};

export default HeroSection;
