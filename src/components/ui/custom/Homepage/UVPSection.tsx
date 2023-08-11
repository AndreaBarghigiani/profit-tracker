// Utils

// Components
import Heading from "@/components/ui/heading";

const UVPSection = () => {
  return (
    <section className="mx-auto my-20 flex justify-around gap-6">
      <div className="text-center">
        <Heading as="h4" size="h3" className=" text-main-500">
          Crystal-Clear Insights for Confident Decisions
        </Heading>

        <p className="text-dog-400">
          Discover the true performance of your crypto investments with
          precision entry price tracking. Our platform empowers you to make
          informed decisions, giving you the confidence to navigate the complex
          crypto market with clarity.
        </p>
      </div>

      <div className="text-center">
        <Heading as="h4" size="h3" className=" text-main-500">
          Stay Ahead of the Curve with Real-Time Updates
        </Heading>

        <p className="text-dog-400">
          Don&apos;t miss a beat in the dynamic world of cryptocurrencies and
          decentralized apps. Underdog Tracker delivers real-time updates on
          your portfolio, ensuring you&apos;re always equipped with the latest
          data to seize opportunities and manage risks effectively.
        </p>
      </div>

      <div className="text-center">
        <Heading as="h4" size="h3" className=" text-main-500">
          Simplify Complexities for Stress-Free Management
        </Heading>

        <p className="text-dog-400">
          Say goodbye to spreadsheet chaos and calculation headaches. Our
          intuitive platform simplifies portfolio management, helping you
          effortlessly track your hodl positions and profits. Spend less time
          crunching numbers and more time strategizing your investment moves.
        </p>
      </div>
    </section>
  );
};

export default UVPSection;
