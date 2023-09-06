// Utils
import { getServerAuthSession } from "@/server/auth";

// Types
import type { NextPageWithLayout } from "./_app";
import type { IncomingMessage, ServerResponse } from "http";

// Components
import LayoutMarketing from "@/components/layoutMarketing";
import HeroSection from "@/components/custom/CLabs/HeroSectionCLabs";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <HeroSection />
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
