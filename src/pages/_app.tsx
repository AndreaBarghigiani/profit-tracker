// Components
import Layout from "@/components/layout";

// Utils
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

// Types
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: Session | null;
};

const MyApp: AppType<AppPropsWithLayout> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <SessionProvider session={session}>
      <Layout>{layout}</Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
