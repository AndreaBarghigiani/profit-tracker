// Utils
import * as React from "react";

// Types
import type { feedbackProps } from "@/server/types";

// Components
import { Html, Heading, Tailwind, Text, Link } from "./index";

export const FeedbackTemplate: React.FC<Readonly<feedbackProps>> = ({
  email,
  username,
  rating,
  message,
  image,
}) => {
  return (
    <Html>
      <Tailwind>
        <Heading>Take a 🍵 and keep reading.</Heading>

        <Text className="text-sm">
          This message has been sent by:{" "}
          <Link href={`mailto://${email}`}>{username}</Link>
        </Text>

        <Text>{message}</Text>

        {!!rating && <Text>Also the user sent you a rating of {rating}</Text>}

        {!!image && (
          <Text>
            You can check the image <Link href={image}>here</Link>.
          </Text>
        )}
      </Tailwind>
    </Html>
  );
};
