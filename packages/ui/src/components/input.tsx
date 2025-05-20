import * as React from "react";

import { cn } from "@orga/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        {...props}
        type={type}
        className={cn(
          "flex h-10 w-full rounded border border-input bg-transparent px-3 py-1 text-sm font-light text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-background",
          className
        )}
        ref={ref}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
