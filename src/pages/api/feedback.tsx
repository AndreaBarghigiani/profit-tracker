import { postmark } from "@/lib/postmark";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({
      error: "Missing email or message",
    });
  }

  try {
    await postmark.sendEmail({
      To: email as string,
      Subject: `Feedback from ${email} for Underdog Tracker`,
      From: "andrea@cupofcraft.dev",
      TextBody: message as string,
      ReplyTo: email as string,
    });

    return res.status(200).json({
      success: true,
      message: "Feedback sent",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error:", error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  }
};

export default handler;
