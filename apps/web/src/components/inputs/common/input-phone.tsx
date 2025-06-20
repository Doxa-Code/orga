import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const InputPhone = forwardRef<
  HTMLInputElement,
  Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
    name?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (phone: string) => void;
  }
>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      value={formatPhone(props.value)}
      className={cn(
        "min-w-[140px] rounded border border-gray-300 pl-3 text-left",
        props.className
      )}
      maxLength={14}
      onChange={(e) => {
        const input = e.target;
        const value = formatPhone(input.value);
        input.value = value;

        if (props.onChange) {
          props.onChange(value);
        }
      }}
    />
  );
});
