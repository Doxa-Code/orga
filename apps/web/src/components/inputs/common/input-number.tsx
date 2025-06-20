import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const InputNumber = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement> & {
    fixed?: number;
    value?: string | number;
    onChange?: (amount: number) => void;
  }
>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      className={cn(
        "min-w-[140px] rounded border border-gray-300 pl-3 text-left",
        props.className
      )}
      defaultValue={props.defaultValue || 0}
      onChange={(e) => {
        const input = e.target;

        let value: number | string = input.value;

        value = Number(value.replace(/\D/g, ""));

        if (props.onChange) {
          props.onChange(value);
        }

        input.value = value.toString();
      }}
      value={
        typeof props.value === "number" ? props.value : props.value || undefined
      }
    />
  );
});
