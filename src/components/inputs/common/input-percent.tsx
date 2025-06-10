import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const InputPercent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex min-w-[140px] overflow-hidden rounded border border-gray-300"
    >
      <div className="flex flex-1 items-center justify-center border-r bg-background px-2">
        <Label className="mb-0 font-medium text-sky-800">%</Label>
      </div>
      <Input
        {...props}
        className={cn(
          "rounded-none !border-none pl-3 text-left",
          props.className
        )}
        defaultValue={props.defaultValue || "0,0"}
        onChange={(e) => {
          const input = e.target;

          let value: number | string = input.value;

          value = Number(value.replace(/\D/g, ""));

          value = (value / 10).toFixed(1);

          input.value = value.replace(".", ",");

          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    </div>
  );
});
