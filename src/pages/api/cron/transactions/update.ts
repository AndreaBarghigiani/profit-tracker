import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const caller = appRouter.createCaller(await createTRPCContext({ res, req }));

  try {
    await caller.transaction.addInterestToAllProjects();
    res.status(200).json({ message: "ok" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ message: cause.message });

      return;
    }

    res.status(500).json({
      error: { message: `Something has gone wrong` },
    });
  }
}
