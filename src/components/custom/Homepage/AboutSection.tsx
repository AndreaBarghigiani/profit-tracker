// Utils

// Components
import DashboardIllustration from "@/components/svg/dashboard";
import Heading from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import ZoomIn from "@/components/custom/ZoomIn";

const AboutSection = () => {
  return (
    <ZoomIn from="left">
      <Card className="mx-auto max-w-4xl grid-cols-3 items-center justify-stretch gap-6 border-main-900 p-10 md:grid md:shadow-main-custom">
        <DashboardIllustration className="hidden md:block" />

        <div className="md:col-span-2">
          <Heading as="h3" size="h1" className=" text-main-500">
            Empowering Your Crypto Investment Journey
          </Heading>

          <p className="text-dog-400">
            Our comprehensive portfolio tracking platform ensures that your
            investment decisions are driven by accurate insights and data.
          </p>
        </div>
      </Card>
    </ZoomIn>
  );
};

export default AboutSection;
