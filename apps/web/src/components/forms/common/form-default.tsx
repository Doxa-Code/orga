import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  type ReactElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

export const FormDefault = forwardRef<
  HTMLFormElement,
  HTMLAttributes<HTMLFormElement> & Props
>(({ form, ...props }, ref) => {
  const passPropsToChildrenRecursively = (children: ReactNode): ReactNode => {
    return React.Children.map(children, (child) => {
      if ((child as any).type === Button) {
        return child;
      }
      if (React.isValidElement(child)) {
        return React.cloneElement(child as ReactElement<any>, {
          form,
          children:
            typeof (child.props as any)?.children === "function"
              ? (child.props as any)?.children
              : passPropsToChildrenRecursively((child.props as any)?.children),
        });
      }
      return child;
    });
  };

  return (
    <Form {...form}>
      <form
        {...props}
        ref={ref}
        className={cn("mb-4 space-y-4", props.className)}
      >
        {passPropsToChildrenRecursively(props.children)}
      </form>
    </Form>
  );
});
