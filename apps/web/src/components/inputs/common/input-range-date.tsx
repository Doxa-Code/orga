import { Paragraph } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";

type Value = {
  start: Date;
  end: Date;
} | null;

type onChange = (value: Value) => void;

export function InputRangeDate({
  className,
  value,
  onChange,
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value: Value;
  onChange: onChange;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.start ? (
              value.end ? (
                <Paragraph className="font-normal text-sm">
                  {format(value.start, "dd/MMM/yyyy", { locale: pt })} -{" "}
                  {format(value.end, "dd/MMM/yyyy", { locale: pt })}
                </Paragraph>
              ) : (
                <Paragraph className="font-normal text-sm">
                  {format(value.start, "dd/MMM/yyyy", { locale: pt })}
                </Paragraph>
              )
            ) : (
              <Paragraph className="font-normal text-sm">
                Selecione a data
              </Paragraph>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.start}
            selected={value ? { from: value.start, to: value.end } : undefined}
            onSelect={(selected) =>
              onChange(
                selected ? { start: selected.from!, end: selected.to! } : null
              )
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
