import { Input } from "@/components/ui/input";
import type { Partner } from "@/core/domain/entities/partner";
import { cn } from "@/lib/utils";
import { formatTaxId } from "@/lib/utils";
import { forwardRef } from "react";

export const InputTaxId = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    disabled?: boolean;
    onChange?: (taxid: string) => void;
    type: Partner.Type;
    className?: string;
  }
>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      className={cn(
        "min-w-[140px] rounded border border-gray-300 pl-3 text-left",
        props.className,
      )}
      maxLength={props.type === "COMPANY" ? 18 : 14}
      value={formatTaxId(props.value, props.type)}
      onChange={(e) => {
        const input = e.target;
        const value = formatTaxId(input.value, props.type);
        input.value = value;

        if (props.onChange) {
          props.onChange(value);
        }
      }}
    />
  );
});
