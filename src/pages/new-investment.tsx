// Types
import type { NextPage } from "next";

// Components
import Heading from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const NewInvestment: NextPage = () => {
  return (
    <>
      <div className="space-y-4">
        <Heading size="page" gradient="gold" spacing={"massive"}>
          New Investment
        </Heading>

        <p className="text-center text-lg text-stone-400">
          Are you building you&apos;re passive income machine? Tracking your
          investments is the way to go.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>HODL</CardTitle>
              <CardDescription>The oldest kind of investment.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Are you buying during the bear market or even DCA into a token?
              </p>
              <p>This is the perfect way to track it</p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/hodl/add`}
                className={buttonVariants({
                  variant: "secondary",
                  size: "sm",
                })}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
              <CardDescription>
                Invest in some high possible returns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                DeFi projects are the best way to build your passive income
                machine, but they&apos;re risky.
              </p>
              <p>Be careful with them.</p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/project/add`}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NewInvestment;
