// Utils

// Components
import Image from "next/image";
import Heading from "@/components/ui/heading";

const AboutSection = () => {
  return (
    <section className="mx-auto my-20 grid max-w-3xl grid-cols-3  items-center gap-6">
      <Image
        src="/man-front-chart.jpg"
        alt="Man in front of a chart graph to empower your crypto investment journey"
        className="rounded-full border-4 border-main-500 shadow-inner"
        width={200}
        height={200}
      />
      <div className="col-span-2">
        <Heading as="h3" size="h2" className=" text-main-500">
          Empowering Your Crypto Investment Journey
        </Heading>

        <p className="text-dog-400">
          At Underdog Tracker, we understand that every crypto investor has a
          unique dream. Whether you&apos;re looking to make your mark in
          decentralized apps or aiming to build a robust crypto portfolio,
          we&apos;re here to support your ambitions. Our comprehensive portfolio
          tracking platform ensures that your investment decisions are driven by
          accurate insights and data.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
