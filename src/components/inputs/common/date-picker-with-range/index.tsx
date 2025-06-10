"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Paragraph } from "@/components/common/typograph";
import { addDays } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { type Filter, type FilterId, ManagerFilter } from "./filters";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type PropsToSelect = {
  onSelectDate(date?: DateRange, filterId?: FilterId): void;
  date?: DateRange;
  initialFilter?: FilterId;
};

type Props = React.HTMLAttributes<HTMLDivElement> & PropsToSelect;

export const DatePickerWithRange: React.FC<Props> = ({
  initialFilter,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<Filter | null>(
    initialFilter ? ManagerFilter.filters.get(initialFilter)! : null
  );
  const [customPeriod, setCustomPeriod] = React.useState(false);

  React.useEffect(() => {
    if (ManagerFilter.filters.has(initialFilter!)) {
      runFilter(ManagerFilter.filters.get(initialFilter!)!, props.date?.from);
    }
  }, [initialFilter]);

  function runFilter(currentFilter: Filter, currentDate?: Date) {
    setFilter(currentFilter);

    if (currentFilter.id !== "custom") {
      const nextDateRange = currentFilter.onSelected({ from: currentDate })!;
      props.onSelectDate(nextDateRange, currentFilter.id);
    }

    setCustomPeriod(currentFilter.id === "custom");
    setOpen(currentFilter.id === "custom");
  }

  return (
    <div className={cn("grid gap-2", props.className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex h-10 w-min items-center justify-start rounded border border-slate-300 bg-background">
          <Button
            variant="ghost"
            className="w-9 h-10 !rounded-r-none bg-transparent p-0 hover:bg-primary/10"
            onClick={() =>
              props.onSelectDate(filter?.prevPeriod?.(props.date)!, filter?.id)
            }
          >
            <ChevronLeft className="text-sky-800" strokeWidth={2} size={20} />
          </Button>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="ghost"
              className="w-[210px] items-center justify-center space-x-1 rounded-none border-x border-slate-300 bg-transparent p-0 text-center hover:bg-primary/10"
            >
              <Paragraph className="font-medium text-sky-900">
                {filter?.generateLabel(props.date) || "Selecione um período"}
              </Paragraph>
              <div>
                <ChevronDown
                  className="ml-1 text-sky-800"
                  strokeWidth={3}
                  size={16}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <Button
            variant="ghost"
            className="w-9 !rounded-l-none bg-transparent p-0 hover:bg-primary/10"
            onClick={() =>
              props.onSelectDate(filter?.nextPeriod?.(props.date)!, filter?.id)
            }
          >
            <ChevronRight className="text-sky-800" strokeWidth={2} size={20} />
          </Button>
        </div>
        <PopoverContent
          data-custom={customPeriod}
          className="w-[200px] border bg-white p-0 data-[custom=true]:w-auto"
          align="start"
        >
          <div className="w-full flex-1 rounded bg-white py-2">
            {Array.from(ManagerFilter.filters.entries()).map(
              ([id, filterOption]) => (
                <Button
                  key={id}
                  variant="ghost"
                  className="flex w-full items-center justify-start rounded"
                  onClick={() => {
                    runFilter(filterOption);
                  }}
                >
                  <Paragraph className="font-light text-slate-800">
                    {filterOption.description}
                  </Paragraph>
                </Button>
              )
            )}
          </div>
          {customPeriod && (
            <Calendar
              autoFocus
              mode="range"
              defaultMonth={props.date?.from}
              selected={props.date}
              onSelect={(date) =>
                props.onSelectDate(
                  !date?.from
                    ? { from: new Date(), to: addDays(new Date(), 1) }
                    : !date?.to
                      ? { from: date?.from, to: addDays(date?.from!, 1) }
                      : date,
                  "custom"
                )
              }
              numberOfMonths={2}
              locale={pt}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
