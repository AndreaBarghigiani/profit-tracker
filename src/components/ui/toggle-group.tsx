// Utils
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

// Types

// Components

const toggleGroupItemClasses = cn(
  "flex items-center justify-center bg-dog-800 px-4 py-2 text-dog-200 text-sm font-medium transition-colors h-10",
  "hover:bg-dog-600",
  // Borders
  "border border-l-0 border-r-0 border-t-dog-600 border-b-dog-600",
  "first:rounded-l first:border-l-dog-600 first:border-l last:rounded-r last:border-r-dog-600 last:border-r",
  // Focus
  "focus:outline-none focus:z-10 focus:ring-2 focus:ring-main-600 focus:ring-offset-main-700",
  // Selected
  "data-[state=on]:text-dog-300 data-[state=on]:bg-dog-900"
);
const ToggleGroup = ToggleGroupPrimitive.Root;
const ToggleItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentProps<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupItemClasses, className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));
ToggleItem.displayName = "ToggleItem";

export { ToggleGroup, ToggleItem };
