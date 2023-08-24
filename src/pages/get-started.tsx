// Utils
import { getServerAuthSession } from "@/server/auth";
import va from "@vercel/analytics";

// Types
import type { NextPageWithLayout } from "./_app";
import type { IncomingMessage, ServerResponse } from "http";

// Components
import { buttonVariants } from "@/components/ui/button";
import LayoutMarketing from "@/components/layoutMarketing";
import Heading from "@/components/ui/heading";
import Image from "next/image";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="my-10 flex h-auto w-full flex-col justify-center">
        <Heading size="page" gradient="gold">
          Thank you for your interest! But this is a closed beta.
        </Heading>

        <Heading
          as="h2"
          size="h2"
          className="mb-8 text-center italic text-dog-400"
        >
          Only members of the{" "}
          <a
            href="https://lucasrubix.samcart.com/referral/cryptolabs/ebELooIHWL6GuzeY"
            target="_blank"
            className="underline"
            onClick={() => {
              va.track("CLabs Membership Sign In");
            }}
          >
            CryptoLabs community
          </a>{" "}
          can join.
        </Heading>
      </div>

      <section className="mx-auto w-2/3">
        <article className="prose prose-xl prose-h2:text-dog-100 prose-h3:text-dog-100 prose-p:text-dog-200 prose-strong:text-dog-100">
          <p>Hey there, crypto explorer! 🚀 </p>
          <p>
            Ready to take your portfolio tracking game to the next level? Look
            no further than our cutting-edge portfolio crypto tracking platform!
          </p>
          <p>
            Imagine a world where you can track every crypto move down to the
            last cent. <br />
            No more guessing games!
          </p>
          <CTA />
          <p>
            With us, you&#39;ll always know your profit and loss based on your
            entry price.
          </p>
          <p>
            That&#39;s right, no more head-scratching when it comes to your
            gains. Speaking of gains, our platform helps you{" "}
            <strong>estimate potential profits from your trades</strong>.
            It&#39;s like having a crystal ball for crypto!
          </p>

          <p>
            And if you&#39;re tired of emotional trading, our DCA Out strategy
            lets you plan your moves without the rollercoaster of feelings.{" "}
          </p>
          <Image
            src="/dca-out-strategy.jpg"
            alt="Image represent the DCA Out Strategy calculator"
            className="mx-auto"
            width={600}
            height={600}
          />
          <p>
            Oh, did we mention we&#39;ve got a spot to jot down all those sweet
            airdrops and rewards you&#39;re scoring? Say goodbye to missed
            opportunities! 🎁
          </p>
          <p>
            But that&#39;s not all! Our portfolio tracker comes with an
            interface so seamless, you&#39;ll wonder how you ever lived without
            it.
          </p>
          <p>No more complicated spreadsheets.</p>
          <p>No more juggling multiple apps.</p>
          <p>
            Just smooth sailing through your crypto universe. And speaking of
            universe, we&#39;re built by crypto enthusiasts for crypto
            enthusiasts.
          </p>
          <p>
            We get you because <strong>we&#39;re one of you.</strong>
          </p>
          <p>And guess what? Your journey doesn&#39;t stop there!</p>
          <p>
            When you join our exclusive CryptoLabs community, you&#39;re not
            just getting access to the beta - you&#39;re joining a family of
            like-minded crypto aficionados.
          </p>
          <CTA />
          <p>
            Get ready for <strong>weekly meetings</strong> packed with insights
            and project discussions. Our community is buzzing with members who
            share helpful content to keep you in the loop.
          </p>
          <p>And our team?</p>
          <p>
            They&#39;re the Jedi Masters of the crypto realm, always ready to
            guide you with the best strategies in the ever-changing market.
          </p>
          <p>
            So, what are you waiting for? Join the beta, become part of the
            CryptoLabs community, and let&#39;s dive into the exciting world of
            crypto tracking together!
          </p>
          <p>
            Click that &quot;Get started&quot; button now and let&#39;s embark
            on this journey of crypto mastery. 🚀🔥
          </p>
          <CTA />
          <Heading size="h2" as="h3" spacing="large">
            Why do we require a CryptoLabs Membership?
          </Heading>
          <p>
            To put it simply, this project was built from the ground up with the
            support of the CryptoLabs team, and at the beginning, I was planning
            to release it as an internal tool.
          </p>
          <p>
            On top of that, you will get a lot from the community. Brilliant
            people are inside, and you get daily opportunities to invest your
            funds intelligently.
          </p>
          <p>
            I could spend countless words trying to convince you to go and
            create your account. Instead, I want you to be informed and DYOR (Do
            Your Own Research, commonly referred to in DeFi).
          </p>
          <p>
            So head over to{" "}
            <a
              href="https://lucasrubix.samcart.com/referral/cryptolabs/ebELooIHWL6GuzeY"
              target="_blank"
              className="text-dog-100 underline"
              onClick={() => {
                va.track("CLabs Membership Sign In");
              }}
            >
              the website
            </a>{" "}
            or, even better, their{" "}
            <a
              href="https://lucasrubix.samcart.com/referral/youtube/ebELooIHWL6GuzeY"
              target="_blank"
              className="text-dog-100 underline"
              onClick={() => {
                va.track("CLabs YouTube Channel");
              }}
            >
              YouTube channel
            </a>{" "}
            and see if the content they present will be helpful in your crypto
            life.
          </p>
        </article>
      </section>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutMarketing>{page}</LayoutMarketing>;
};

export default Home;

const CTA = () => {
  return (
    <div className=" mx-auto w-5/6 rounded-xl border border-dog-800 bg-dog-900 p-6 text-center">
      <Heading as="h2" size="h2" className="my-0">
        Are you ready to join the beta?
      </Heading>
      <p className="text-sm">It&apos;s as easy as to invest in your future.</p>

      <div className="mt-6 flex flex-col items-center justify-center">
        <a
          href="https://lucasrubix.samcart.com/referral/cryptolabs/ebELooIHWL6GuzeY"
          target="_blank"
          className={buttonVariants({
            className: "mb-3 no-underline",
            variant: "active",
          })}
          onClick={() => {
            va.track("CLabs Membership Sign In");
          }}
        >
          Get started
        </a>

        <p className="text-xs text-dog-400">
          Once inside the commynity, and DM &quot;Andrea Barghigiani&quot; to
          get access
        </p>
      </div>
    </div>
  );
};
export async function getServerSideProps(context: {
  req: IncomingMessage & {
    cookies: Partial<{ [key: string]: string }>;
  };
  res: ServerResponse<IncomingMessage>;
}) {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
