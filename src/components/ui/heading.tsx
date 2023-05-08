// Utils
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
import type { VariantProps } from "class-variance-authority";

export type HeadingProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<C> &
  VariantProps<typeof headingVariants>;

const headingVariants = cva("font-semibold mb-4", {
  variants: {
    size: {
      h1: "text-3xl",
      h2: "text-2xl",
      h3: "text-xl",
      h4: "text-lg",
      page: "text-8xl text-center font-bold my-8",
    },
    gradient: {
      gold: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent via-yellow-500 to-accent text-transparent bg-clip-text",
    },
  },
  defaultVariants: {
    size: "h1",
  },
});

const Heading = <C extends React.ElementType = "h1">({
  as,
  children,
  size,
  gradient,
  className,
}: HeadingProps<C>) => {
  const Component = as || "h1";
  return (
    <Component className={cn(headingVariants({ size, gradient, className }))}>
      {children}
    </Component>
  );
};

export default Heading;
