import { createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "@/server/api/routers/project";
import { transactionRouter } from "@/server/api/routers/transaction";
import { walletRouter } from "@/server/api/routers/wallet";
import { userRouter } from "@/server/api/routers/user";
import { tokenRouter } from "@/server/api/routers/token";
import { hodlRouter } from "@/server/api/routers/hodl";
import { dcaRouter } from "@/server/api/routers/dca";
import { userWalletsRouter } from "@/server/api/routers/userWallets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  transaction: transactionRouter,
  wallet: walletRouter,
  user: userRouter,
  userWallets: userWalletsRouter,
  token: tokenRouter,
  hodl: hodlRouter,
  dca: dcaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
