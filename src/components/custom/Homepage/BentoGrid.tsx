// Utils
// import { signIn } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import va from "@vercel/analytics";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

// Components
import Heading from "@/components/ui/heading";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const BentoGrid = () => {
  return (
    <div className="grid auto-rows-min grid-cols-4 gap-4">
      <BentoCard>
        <BentoCardTitle>Track Any Crypto</BentoCardTitle>
      </BentoCard>

      <BentoCard className="col-span-2 row-span-2">
        <BentoCardTitle>Crystal-Clear Insights</BentoCardTitle>
      </BentoCard>

      <BentoCard>
        <BentoCardTitle>Profit Estimator</BentoCardTitle>
      </BentoCard>

      <BentoCard>
        <BentoCardTitle>Exit Strategy</BentoCardTitle>
      </BentoCard>

      <BentoCard>
        <BentoCardTitle>Airdrop Tracker</BentoCardTitle>
      </BentoCard>

      <BentoCard>
        <BentoCardTitle>Whale Watcher</BentoCardTitle>
      </BentoCard>

      <BentoCard>
        <BentoCardTitle>ROI dApp Tracker</BentoCardTitle>
      </BentoCard>

      <BentoCard className="col-span-2">
        <BentoCardTitle>All Based on Your Entry Price</BentoCardTitle>
      </BentoCard>
    </div>
  );
};

export default BentoGrid;

const BentoCard = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  props?: HTMLParagraphElement;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    clientX,
    clientY,
    currentTarget,
  }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // console.log("mouses", mouseX, mouseY);
  return (
    <div
      className={cn(
        "group relative flex items-center justify-center rounded-xl border border-dog-800 bg-gradient-to-bl from-background to-dog-900 text-dog-400",
        className,
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-50"
        style={{
          background: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 227, 128, .4) 0%, transparent 60%)`,
        }}
      />

      {children}
    </div>
  );
};

const BentoCardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <CardHeader>
      <CardTitle className="text-center text-2xl text-dog-400">
        {children}
      </CardTitle>
    </CardHeader>
  );
};
