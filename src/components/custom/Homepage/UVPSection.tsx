// Utils

// Components
import Heading from "@/components/ui/heading";
import ClearInsight from "@/components/svg/clear-insight";
import RealTimeUpdate from "@/components/svg/real-time-update";
import StressFree from "@/components/svg/stress-free";
import { Card } from "@/components/ui/card";
import ZoomIn from "@/components/custom/ZoomIn";

const UVPSection = () => {
  return (
    <>
      <ZoomIn from="left">
        <Card className="mx-auto max-w-4xl grid-cols-3 items-center justify-stretch gap-6 border-main-900 p-10 md:grid md:shadow-main-custom">
          <ClearInsight className="hidden md:block" />

          <div className="md:col-span-2">
            <Heading as="h3" size="h1" className=" text-main-500">
              Crystal-Clear Insights for Confident Decisions
            </Heading>

            <p className="text-dog-400">
              Discover the true performance of your crypto investments with
              precision entry price tracking. Our platform empowers you to make
              informed decisions, giving you the confidence to navigate the
              complex crypto market with clarity.
            </p>
          </div>
        </Card>
      </ZoomIn>

      <ZoomIn from="right">
        <Card className="mx-auto max-w-4xl grid-cols-3 items-center justify-stretch gap-6 border-main-900 p-10 md:grid md:shadow-main-custom">
          <div className="md:col-span-2">
            <Heading as="h3" size="h1" className=" text-main-500">
              Stay Ahead of the Curve with Real-Time Updates
            </Heading>

            <p className="text-dog-400">
              Don&apos;t miss a beat in the dynamic world of cryptocurrencies
              and decentralized apps. Underdog Tracker delivers real-time
              updates on your portfolio, ensuring you&apos;re always equipped
              with the latest data to seize opportunities and manage risks
              effectively.
            </p>
          </div>

          <RealTimeUpdate className="hidden md:block" />
        </Card>
      </ZoomIn>

      <ZoomIn from="left">
        <Card className="mx-auto max-w-4xl grid-cols-3 items-center justify-stretch gap-6 border-main-900 p-10 md:grid md:shadow-main-custom">
          <StressFree className="hidden md:block" />

          <div className="md:col-span-2">
            <Heading as="h3" size="h1" className=" text-main-500">
              Simplify Complexities for Stress-Free Management
            </Heading>

            <p className="text-dog-400">
              Say goodbye to spreadsheet chaos and calculation headaches. Our
              intuitive platform simplifies portfolio management, helping you
              effortlessly track your hodl positions and profits. Spend less
              time crunching numbers and more time strategizing your investment
              moves.
            </p>
          </div>
        </Card>
      </ZoomIn>
    </>
  );
};

export default UVPSection;
