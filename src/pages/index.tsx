// Utils
import { getServerAuthSession } from "@/server/auth";

// Types
import type { NextPageWithLayout } from "./_app";
import type { IncomingMessage, ServerResponse } from "http";

// Components
import LayoutMarketing from "@/components/layoutMarketing";
import HeroSection from "@/components/custom/Homepage/HeroSection";
import BentoGrid from "@/components/custom/Homepage/BentoGrid";
import AboutSection from "@/components/custom/Homepage/AboutSection";
import ProblemSection from "@/components/custom/Homepage/ProblemSection";
import UVPSection from "@/components/custom/Homepage/UVPSection";
import CTASection from "@/components/custom/Homepage/CTASection";
import MuxPlayer from "@mux/mux-player-react";
import { motion } from "framer-motion";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <HeroSection />

      <div className="hidden md:block md:h-screen">
        <div className="sticky z-10 flex h-128 items-center justify-stretch px-10">
          <div className="absolute left-1/2 h-full w-full -translate-x-1/2 animate-bg-pulse bg-main-200 opacity-10 blur-5xl" />
          <MuxPlayer
            streamType="on-demand"
            playbackId="ZS2oz9zJQZf6Y4IklYHNu12VodpCAag00PpZed9dT5ds"
            autoPlay="muted"
            className="border border-main-900"
            loop={true}
          />
        </div>
      </div>

      <div className="md:h-[150vh]">
        <div className="z-10 mb-20 flex items-center justify-stretch md:sticky md:top-1/2 md:mb-0 md:h-128 md:-translate-y-1/2 md:px-10">
          <motion.div
            className="left-1/2 hidden h-1/2 w-1/2 -translate-x-1/2 animate-bg-pulse bg-main-200 opacity-10 blur-5xl md:absolute"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
          />
          <BentoGrid />
        </div>
      </div>
      <div className="flex flex-col space-y-6 md:h-[4000px] md:gap-y-128 md:space-y-0">
        <AboutSection />
        <ProblemSection />
        <UVPSection />
      </div>

      <CTASection />
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutMarketing>{page}</LayoutMarketing>;
};

export default Home;

export async function getServerSideProps(context: {
  req: IncomingMessage & {
    cookies: Partial<{ [key: string]: string }>;
  };
  res: ServerResponse<IncomingMessage>;
}) {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
