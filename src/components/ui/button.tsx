// Utils
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
import type { VariantProps } from "class-variance-authority";

// Components
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center text-sm font-medium transition-colors focus:outline-none focus:z-10 focus:ring-2 focus:ring-main-600 focus:ring-offset-main-700 disabled:opacity-50 disabled:pointer-events-none ",
  {
    variants: {
      variant: {
        default: "bg-dog-200 text-primary-foreground hover:bg-main",
        active: "bg-accent text-accent-foreground hover:bg-accent/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-dog-300 text-dog-300 hover:border-main-600 hover:text-main-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-dog-300 hover:text-main-600",
        "ghost-danger":
          "text-alert-300 hover:text-primary-foreground hover:bg-alert-400",
        link: "underline-offset-4 hover:underline hover:text-main-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        link: "h-auto py-0 px-0",
        xs: "h-6 px-1",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        nav: "w-full h-10 py-2 px-4",
      },
      align: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      },
      corners: {
        rounded: "rounded-md",
        square: "rounded-none",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      align: "center",
      corners: "rounded",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
