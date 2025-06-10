"use client";
import { Paragraph } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import React from "react";

type Props<T> = {
  placeholder?: string;
  options?: (T & { className?: string })[];
  selected?: T[keyof T] | null;
  onSelect(option: T[keyof T] | null): void;
  label: keyof T;
  value: keyof T;
};

export function SelectPopover<T>(props: Props<T>) {
  const [open, setOpen] = React.useState(false);

  const selected = (props.options || []).find(
    (option) =>
      option[props.value] === props.selected ||
      Number(option[props.value]) === Number(props.selected)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="ghost"
          className="h-10 w-[180px] items-center justify-between space-x-1 rounded border border-slate-300 bg-background text-center hover:bg-primary/10"
        >
          <Paragraph className="font-medium text-sky-900">
            {selected
              ? (selected[props.label] as string)
              : props.placeholder || "Selecione"}
          </Paragraph>
          <div className="flex items-center">
            <X
              data-hidden={!selected}
              size={14}
              strokeWidth={3}
              className="text-sky-800 opacity-80"
              onClick={() => {
                props.onSelect(null);
              }}
            />
            <ChevronDown
              className="ml-1 text-sky-800"
              strokeWidth={3}
              size={16}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] border bg-white p-0" align="start">
        <div className="w-full flex-1 rounded bg-white py-1">
          {props.options?.map((option, i) => (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start rounded text-slate-800",
                option.className
              )}
              onClick={() => {
                props.onSelect(option[props.value]);
                setOpen(false);
              }}
            >
              <Paragraph className="font-light ">
                {(option[props.label] as string) || ""}
              </Paragraph>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
