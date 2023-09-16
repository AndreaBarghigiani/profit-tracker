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

const headingVariants = cva("font-semibold", {
  variants: {
    size: {
      h1: "text-3xl",
      h2: "text:lg md:text-2xl",
      h3: "text-xl",
      h4: "text-lg",
      page: "text-4xl lg:text-8xl text-center font-bold leading-tight",
    },
    gradient: {
      gold: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent via-yellow-500 to-accent text-transparent bg-clip-text",
    },
    spacing: {
      none: "my-0",
      small: "my-1",
      normal: "my-2",
      large: "my-4",
      xl: "my-6",
      "2xl": "my-8",
      massive: "my-10",
    },
  },
  defaultVariants: {
    size: "h1",
    spacing: "normal",
  },
});

const Heading = <C extends React.ElementType = "h1">({
  as,
  children,
  size,
  gradient,
  spacing,
  className,
  ...props
}: HeadingProps<C>) => {
  const Component = as || "h1";
  return (
    <Component
      className={cn(headingVariants({ size, gradient, spacing, className }))}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Heading;
