import type { InputFormDefaultProps } from "@/components/type";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = {
  slots: number;
} & InputFormDefaultProps;

export const OTPInputForm = forwardRef<HTMLInputElement, Props>(
  ({ form, ...props }, ref) => {
    return (
      <FormField
        control={form?.control}
        name={props.name}
        render={({ field }) => (
          <FormItem data-hidden={props.hidden} className={props.className}>
            <FormLabel className={cn(props.required && "required")}>
              {props.label}
            </FormLabel>
            <FormControl>
              <InputOTP
                {...field}
                autoFocus={props.hidden ? undefined : true}
                ref={ref}
                maxLength={props.slots}
              >
                <InputOTPGroup className="space-x-2">
                  {Array.from({ length: props.slots || 0 }).map((_, index) => (
                    <InputOTPSlot index={index} key={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
            <FormDescription>{props.description}</FormDescription>
          </FormItem>
        )}
      />
    );
  }
);
