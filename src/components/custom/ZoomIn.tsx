// Utils
import { useScreen } from "usehooks-ts";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
import type { ReactNode } from "react";

const ZoomIn = ({
  children,
  from,
}: {
  children: ReactNode;
  from: "left" | "right";
}) => {
  const screen = useScreen();
  const isMobile = screen?.width && screen.width < 600;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.5 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1]);

  const rotateStart = from === "left" ? -30 : 30;
  const rotateEnd = from === "left" ? -1 : 1;
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.9],
    [rotateStart, rotateEnd],
  );

  const translateXStart = from === "left" ? -500 : 500;
  const translateXEnd = from === "left" ? -50 : 50;
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.9],
    [translateXStart, translateXEnd],
  );

  return (
    <motion.div
      className={cn("z-10 md:sticky md:top-1/3 md:-translate-y-1/2", {
        "origin-bottom-left": from === "left",
        "origin-bottom-right": from === "right",
      })}
      ref={ref}
      style={{
        scale: isMobile ? 1 : scale,
        opacity: isMobile ? 1 : opacity,
        rotate: isMobile ? "0deg" : rotate,
        translateX: isMobile ? "0px" : translateX,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ZoomIn;
