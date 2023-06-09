// Types
import Heading from "@/components/ui/heading";
import type { NextPage } from "next";

// Components

// Understand why the loop with values doesn't work
// const colors = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const Colors: NextPage = () => {
  const colorClasses = "flex h-20 w-20 items-center justify-center";

  return (
    <>
      <div className="my-2">
        <Heading>Main</Heading>
        <div className="flex gap-2">
          <div className={`${colorClasses} bg-main-50`}>
            <span>50</span>
          </div>
          <div className={`${colorClasses} bg-main-100`}>
            <span>100</span>
          </div>
          <div className={`${colorClasses} bg-main-200`}>
            <span>200</span>
          </div>
          <div className={`${colorClasses} bg-main-300`}>
            <span>300</span>
          </div>
          <div className={`${colorClasses} bg-main-400`}>
            <span>400</span>
          </div>
          <div className={`${colorClasses} bg-main-500`}>
            <span>500</span>
          </div>
          <div className={`${colorClasses} bg-main-600`}>
            <span>600</span>
          </div>
          <div className={`${colorClasses} bg-main-700`}>
            <span>700</span>
          </div>
          <div className={`${colorClasses} bg-main-800`}>
            <span>800</span>
          </div>
          <div className={`${colorClasses} bg-main-900`}>
            <span>900</span>
          </div>
        </div>
      </div>
      <div className="my-2">
        <Heading>Dog / Gray</Heading>
        <div className="flex gap-2">
          <div className={`${colorClasses} bg-dog-50`}>
            <span>50</span>
          </div>
          <div className={`${colorClasses} bg-dog-100`}>
            <span>100</span>
          </div>
          <div className={`${colorClasses} bg-dog-200`}>
            <span>200</span>
          </div>
          <div className={`${colorClasses} bg-dog-300`}>
            <span>300</span>
          </div>
          <div className={`${colorClasses} bg-dog-400`}>
            <span>400</span>
          </div>
          <div className={`${colorClasses} bg-dog-500`}>
            <span>500</span>
          </div>
          <div className={`${colorClasses} bg-dog-600`}>
            <span>600</span>
          </div>
          <div className={`${colorClasses} bg-dog-700`}>
            <span>700</span>
          </div>
          <div className={`${colorClasses} bg-dog-800`}>
            <span>800</span>
          </div>
          <div className={`${colorClasses} bg-dog-900`}>
            <span>900</span>
          </div>
        </div>
      </div>
      <div className="my-2">
        <Heading>Alert</Heading>
        <div className="flex gap-2">
          <div className={`${colorClasses} bg-alert-50`}>
            <span>50</span>
          </div>
          <div className={`${colorClasses} bg-alert-100`}>
            <span>100</span>
          </div>
          <div className={`${colorClasses} bg-alert-200`}>
            <span>200</span>
          </div>
          <div className={`${colorClasses} bg-alert-300`}>
            <span>300</span>
          </div>
          <div className={`${colorClasses} bg-alert-400`}>
            <span>400</span>
          </div>
          <div className={`${colorClasses} bg-alert-500`}>
            <span>500</span>
          </div>
          <div className={`${colorClasses} bg-alert-600`}>
            <span>600</span>
          </div>
          <div className={`${colorClasses} bg-alert-700`}>
            <span>700</span>
          </div>
          <div className={`${colorClasses} bg-alert-800`}>
            <span>800</span>
          </div>
          <div className={`${colorClasses} bg-alert-900`}>
            <span>900</span>
          </div>
        </div>
      </div>

      <div className="my-2">
        <Heading>Success</Heading>
        <div className="flex gap-2">
          <div className={`${colorClasses} bg-success-50`}>
            <span>50</span>
          </div>
          <div className={`${colorClasses} bg-success-100`}>
            <span>100</span>
          </div>
          <div className={`${colorClasses} bg-success-200`}>
            <span>200</span>
          </div>
          <div className={`${colorClasses} bg-success-300`}>
            <span>300</span>
          </div>
          <div className={`${colorClasses} bg-success-400`}>
            <span>400</span>
          </div>
          <div className={`${colorClasses} bg-success-500`}>
            <span>500</span>
          </div>
          <div className={`${colorClasses} bg-success-600`}>
            <span>600</span>
          </div>
          <div className={`${colorClasses} bg-success-700`}>
            <span>700</span>
          </div>
          <div className={`${colorClasses} bg-success-800`}>
            <span>800</span>
          </div>
          <div className={`${colorClasses} bg-success-900`}>
            <span>900</span>
          </div>
        </div>
      </div>

      <div className="my-2">
        <Heading>Info</Heading>
        <div className="flex gap-2">
          <div className={`${colorClasses} bg-info-50`}>
            <span>50</span>
          </div>
          <div className={`${colorClasses} bg-info-100`}>
            <span>100</span>
          </div>
          <div className={`${colorClasses} bg-info-200`}>
            <span>200</span>
          </div>
          <div className={`${colorClasses} bg-info-300`}>
            <span>300</span>
          </div>
          <div className={`${colorClasses} bg-info-400`}>
            <span>400</span>
          </div>
          <div className={`${colorClasses} bg-info-500`}>
            <span>500</span>
          </div>
          <div className={`${colorClasses} bg-info-600`}>
            <span>600</span>
          </div>
          <div className={`${colorClasses} bg-info-700`}>
            <span>700</span>
          </div>
          <div className={`${colorClasses} bg-info-800`}>
            <span>800</span>
          </div>
          <div className={`${colorClasses} bg-info-900`}>
            <span>900</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Colors;
