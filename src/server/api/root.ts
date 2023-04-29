import { createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "@/server/api/routers/project";
import { transactionRouter } from "@/server/api/routers/transaction";
import { walletRouter } from "@/server/api/routers/wallet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  transaction: transactionRouter,
  wallet: walletRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
