import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { type HTMLAttributes, forwardRef } from "react";

export const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

export const Logo = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={cn(`${poppins.className} text-4xl font-bold`, props.className)}
    />
  );
});

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    switch (props.level) {
      case 1:
        return (
          <h1
            {...props}
            ref={ref}
            className={cn("text-xl font-semibold text-black", props.className)}
          />
        );
      case 2:
        return (
          <h1
            {...props}
            ref={ref}
            className={cn("text-lg font-medium text-title", props.className)}
          />
        );
    }
  },
);

export const Paragraph = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>((props, ref) => (
  <p {...props} ref={ref} className={cn("font-light", props.className)} />
));
