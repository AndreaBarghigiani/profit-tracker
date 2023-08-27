// Utils
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { feedbackSchema } from "@/server/types";

// Types
import type { feedbackProps } from "@/server/types";

// Components
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import StarRating from "@/components/ui/custom/StarRating";

const defaultValues: Partial<feedbackProps> = {
  username: "demo",
  email: "demo@underdogtracker.xyz",
  message: "",
  image: "http://your-hodl.screenshot.com",
};

const FeedbackComponent = ({}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<feedbackProps>({
    resolver: zodResolver(feedbackSchema),
    defaultValues,
  });

  const feedbackMutation = useMutation(async (values: feedbackProps) => {
    const res = await fetch("/api/emails/feedback", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    return res.json();
  });

  if (!session) return null;

  if (session.user.email) {
    form.setValue("email", session.user.email);
  }

  if (session.user.name) {
    form.setValue("username", session.user.name);
  }

  const onSubmit = (values: feedbackProps) => {
    feedbackMutation.mutate(values);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center">
          <MessageSquare size={16} className="mr-2" />
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 border-dog-600 px-6 py-3"
        align="end"
        sideOffset={10}
      >
        <Heading as="h3" size="h3" className="text-dog-200">
          Share your Feedback
        </Heading>
        <p className="mb-4 text-sm text-dog-400">
          Feel free to share the good, the bad and the ugly of this application.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="my-2 w-full">
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <Textarea placeholder="Here goes your text..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="rating"
              render={({}) => (
                <FormItem className="mb-2 mt-3 flex items-center gap-4 space-y-0">
                  <FormLabel>Rating</FormLabel>
                  <StarRating
                    onSelected={(rate) => form.setValue("rating", rate)}
                  />
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="my-2 w-full">
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <FormDescription className="text-dog-600">
                    You can use any cloud hosting providers like:{" "}
                    <a
                      className="underline"
                      href="https://imgbb.com/"
                      target="_blank"
                    >
                      imgbb
                    </a>{" "}
                    or any other alternative.
                  </FormDescription>
                  <Input placeholder="Here goes the image URL..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mb-3 mt-4">
              Submit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackComponent;
