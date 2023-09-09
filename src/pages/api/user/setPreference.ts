import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { redis } from "@/lib/redis";

// Types
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserCache } from "@/server/types";

export default async function acceptMessage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const query = req.body as {
      prefId: string;
      prefValue: string;
      userId: string;
    };

    try {
      const { prefId, prefValue, userId } = query;

      const redisUser: string | null = await redis.get(userId);
      const userParsed =
        typeof redisUser === "string"
          ? (JSON.parse(redisUser) as UserCache)
          : null;

      const setUserPref: UserCache = !!userParsed
        ? {
            ...userParsed,
            preferences: { ...userParsed.preferences, [prefId]: prefValue },
          }
        : {
            modals: {},
            preferences: { [prefId]: prefValue },
          };

      await redis.set(userId, JSON.stringify(setUserPref));

      res.status(200).json({ message: "ok" });
    } catch (cause) {
      if (cause instanceof TRPCError) {
        const httpStatusCode = getHTTPStatusCodeFromError(cause);
        res.status(httpStatusCode).json({ message: cause.message });
        return;
      }
      res.status(500).json({
        error: { message: "Something wrong" },
      });
    }
  } else {
    res.status(500).json({
      error: { message: "We only handle POST" },
    });
  }
}
