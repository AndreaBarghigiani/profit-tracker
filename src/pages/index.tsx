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
import SolutionSection from "@/components/custom/Homepage/SolutionSection";
import UVPSection from "@/components/custom/Homepage/UVPSection";
import CTASection from "@/components/custom/Homepage/CTASection";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <HeroSection />
      <div
        className="-mt-48 px-10 py-48"
        style={{
          background: `radial-gradient(ellipse, rgba(255, 227, 128, .15) 0%, transparent 60%)`,
        }}
      >
        <BentoGrid />
      </div>
      <AboutSection />
      <ProblemSection />
      <SolutionSection />
      <UVPSection />
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
