import { cn } from "@/lib/utils";

type SkeletonProps<C extends React.ElementType> = {
  as?: C;
  className?: string;
  props?: React.ComponentPropsWithoutRef<C>;
};
const Skeleton = <C extends React.ElementType = "div">({
  className,
  as,
  ...props
}: SkeletonProps<C>) => {
  const Component = as || "div";
  return (
    <Component
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export { Skeleton };
