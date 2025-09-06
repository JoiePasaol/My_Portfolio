import { memo } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"; 

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-black hover:bg-black/80",
        secondary: "border-transparent bg-black hover:bg-black/80",
        destructive: "border-transparent bg-black hover:bg-black/80",
        outline: "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = memo(({ className, variant, ...props }) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };

