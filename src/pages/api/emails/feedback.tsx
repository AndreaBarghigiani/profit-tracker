/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Resend } from "resend";
import { feedbackSchema as reqBodySchema } from "@/server/types";

// Types
import type { NextApiRequest, NextApiResponse } from "next";

// Components
import { FeedbackTemplate } from "@/components/emails/FeedbackTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = reqBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Missing something, I'll improve the error message later",
    });
  }

  const { email, message, rating, image, username } = result.data;

  try {
    await resend.emails.send({
      from: "Underdog Tracker Feedback <feedback@underdogtracker.xyz>",
      to: ["a.barghigiani@gmail.com"],
      reply_to: email,
      subject: `Feedback from ${username}`,
      react: FeedbackTemplate({
        email,
        message,
        rating,
        image,
        username,
      }) as React.ReactElement,
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
