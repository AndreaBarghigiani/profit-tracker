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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center">
          <MessageSquare size={16} className="mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your Feedback</DialogTitle>
          <DialogDescription>
            Feel free to share the good, the bad and the ugly of this
            application.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <Textarea placeholder="Here goes your text..." {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="rating"
              render={({}) => (
                <FormItem>
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
                <FormItem className="w-full">
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

            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackComponent;
