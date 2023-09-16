// Components
import Heading from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import TrackingIllustration from "@/components/svg/tracking";
import ZoomIn from "../ZoomIn";

const ProblemSection = () => {
  return (
    <ZoomIn from="right">
      <Card className="mx-auto max-w-4xl grid-cols-3 items-center justify-stretch gap-6 border-main-900 p-10 md:grid md:shadow-main-custom">
        <div className="md:col-span-2">
          <Heading as="h3" size="h1" className=" text-main-500">
            Crypto Investment doesn&apos;t have to be complicated
          </Heading>

          <p className="text-dog-400">
            As a crypto investor, you know the challenge of keeping tabs on your
            multiple hodl positions and understanding the true profitability of
            your investments. With us, you can simplify your journey.
          </p>
        </div>

        <TrackingIllustration className="hidden md:block" />
      </Card>
    </ZoomIn>
  );
};

export default ProblemSection;
