"use client";
import { Input } from "@orga/ui/input";
import { cn } from "@orga/utils";
import { Label } from "@orgabel";
import { type HTMLAttributes, forwardRef } from "react";

export const InputMoney = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLInputElement> & {
    value?: string | number;
    onChange?: (amount: number) => void;
    disabled?: boolean;
  }
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex min-w-[140px] mb-1 h-10 overflow-hidden rounded border border-gray-300"
    >
      <div className="flex flex-1 items-center justify-center border-r bg-background px-2">
        <Label className="mb-0 font-medium text-sky-800">R$</Label>
      </div>
      <Input
        {...props}
        className={cn(
          "rounded-none !border-none pl-2 text-left",
          props.className,
        )}
        defaultValue={props.defaultValue || "0,00"}
        onFocus={(e) => {
          const input = e.target;

          input.setSelectionRange(input.value.length, input.value.length);
        }}
        onChange={(e) => {
          const input = e.target;

          let value: number | string = input.value;

          value = Number(value.replace(/\D/g, ""));

          if (props.onChange) {
            props.onChange(value / 100);
          }

          value = (value / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          input.value = value.replace("R$", "");
        }}
        value={
          typeof props.value === "number"
            ? props.value
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
                .replace("R$", "")
            : props.value || undefined
        }
      />
    </div>
  );
});
