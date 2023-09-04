// Utils
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
import type { VariantProps } from "class-variance-authority";

// Components
import * as React from "react";
const buttonVariants = cva(
  "inline-flex items-center text-sm font-medium transition-colors focus:outline-none focus:z-10 focus:ring-2 focus:ring-main-600 focus:ring-offset-main-700 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-dog-200 text-primary-foreground hover:bg-main disabled:hover:bg-dog-200",
        active:
          "bg-accent text-accent-foreground hover:bg-accent/90 disabled:hover:bg-accent",
        orange:
          "bg-orange-500 text-primary-foreground hover:bg-orange-300 disabled:hover:bg-orange-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:hover:bg-destructive",
        outline:
          "border border-dog-300 text-dog-300 hover:border-main-600 hover:text-main-600",
        "outline-danger":
          "border border-alert-300 text-alert-300 hover:border-alert-400 hover:text-alert-400",
        "outline-success":
          "border border-success-600 text-success-600 hover:border-success-500 hover:text-success-500",
        "outline-orange":
          "border border-orange-600 text-orange-600 hover:border-orange-500 hover:text-orange-500",
        "outline-input": "border border-dog-600 bg-background",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-dog-300 hover:text-main-500 focus:ring-0",
        "ghost-danger":
          "text-alert-300 hover:text-primary-foreground hover:bg-alert-400",
        link: "underline-offset-4 hover:underline hover:text-main-600",
        admin: "bg-alert-200 text-alert-900	",
        adminOutline:
          "border border-alert-200 text-alert-200 hover:bg-alert-200 hover:text-alert-900",
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
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, align, corners, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, align, corners, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
