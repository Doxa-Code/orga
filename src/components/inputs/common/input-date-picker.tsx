import { Paragraph } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { LucideCalendar } from "lucide-react";

interface InputDatePickerProps {
  date?: Date;
  onSelectDate(date?: Date): void;
}

export function InputDatePicker(props: InputDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-10 w-[200px] justify-between overflow-hidden rounded border border-gray-300 bg-transparent p-0 text-left font-normal hover:bg-transparent"
          )}
        >
          <Paragraph className="pl-2 text-gray-700">
            {isValid(props.date) &&
              format(props.date!, "dd/MM/yyyy", { locale: pt })}
          </Paragraph>
          <div className="flex h-10 items-center justify-center border-l border-gray-300 bg-background px-3">
            <LucideCalendar className="h-4 w-4 text-sky-800" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={props.onSelectDate}
          autoFocus
          locale={pt}
        />
      </PopoverContent>
    </Popover>
  );
}
