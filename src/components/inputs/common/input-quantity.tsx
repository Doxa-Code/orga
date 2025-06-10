import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const InputQuantity = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement> & {
    fixed?: 2 | 1;
    value?: string;
    disabled?: boolean;
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
      defaultValue={
        props.defaultValue || (0).toFixed(props.fixed || 2).replace(".", ",")
      }
      onChange={(e) => {
        const input = e.target;

        const DIVIDER = props.fixed === 1 ? 10 : 100;

        let value: number | string = input.value;

        value = Number(value.replace(/\D/g, ""));

        if (props.onChange) {
          props.onChange(value / DIVIDER);
        }

        value = (value / DIVIDER).toFixed(props.fixed || 2);

        input.value = value.replace(".", ",");
      }}
    />
  );
});
