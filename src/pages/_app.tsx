// Utils
import { api } from "@/utils/api";

// Types
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

// Components
import Layout from "@/components/layout";
import NextTopLoader from "nextjs-toploader";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <SessionProvider session={session as Session}>
      <Head>
        <title>Underdog Tracker - Track your profits like never before</title>
        <meta
          name="description"
          content="Underdog Tracker is a simple app that let's you know all your profits and help you grow your passive income."
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <NextTopLoader color="#ffcd1a" />
      <Layout>{layout}</Layout>
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
