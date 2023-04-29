// Components
import Layout from "@/components/layout";

// Utils 
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

// Types 
import { type AppType } from "next/app";
import { type Session } from "next-auth";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
