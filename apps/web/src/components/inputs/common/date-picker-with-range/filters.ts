import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { pt } from "date-fns/locale/pt";
import type { DateRange } from "react-day-picker";

export type PropsToSelect = {
  date?: DateRange;
  // onSelectCustomDate(): void;
};

export type FilterId =
  | "today"
  | "week"
  | "lastMonth"
  | "month"
  | "year"
  | "last30days"
  | "last12month"
  | "custom";

export abstract class Filter {
  abstract id: FilterId;

  showDescription = true;

  abstract description: string;

  onSelected(_date?: DateRange): DateRange | void {}
  nextPeriod(_date?: DateRange): DateRange | void {}
  prevPeriod(_date?: DateRange): DateRange | void {}

  generateLabel(date?: DateRange) {
    if (this.showDescription) {
      return this.description;
    }

    if (date?.from && date?.to) {
      return `${format(date.from, "dd MMM y", { locale: pt })} - ${format(
        date.to,
        "dd MMM y",
        { locale: pt },
      )}`;
    }

    return "...";
  }
}

class ManagerFilter {
  static filters: Map<FilterId, Filter> = new Map();
  static register(...ClassesFilter: any[]) {
    for (const ClassFilter of ClassesFilter) {
      const filter = new ClassFilter();
      this.filters.set(filter.id, filter);
    }
  }
}

ManagerFilter.register(
  class extends Filter {
    id: FilterId = "today";
    description = "Hoje";

    private canShowDescription({ from, to }: DateRange) {
      return isSameDay(from!, new Date()) || isSameDay(to!, new Date());
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: startOfDay(nextDate),
        to: endOfDay(nextDate),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addDays(currentDate, 1);

      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = subDays(currentDate, 1);

      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();

      return this.createDateRange(currentDate);
    }

    generateLabel(date?: DateRange) {
      if (this.showDescription) {
        return this.description;
      }

      if (date?.from) {
        return format(date.from, "dd LLL y", { locale: pt });
      }

      return "...";
    }
  },
  class extends Filter {
    id: FilterId = "week";
    description = "Esta semana";

    private canShowDescription({ from }: DateRange) {
      return isSameWeek(from!, new Date());
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: startOfWeek(nextDate),
        to: endOfWeek(nextDate),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addWeeks(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      this.showDescription = false;
      const currentDate = date?.from || new Date();
      const nextDate = subWeeks(currentDate, 1);

      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();

      return this.createDateRange(currentDate);
    }
  },
  class extends Filter {
    id: FilterId = "month";
    description = "Este mês";

    private canShowDescription({ from }: DateRange) {
      return isSameMonth(from!, new Date());
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: startOfMonth(nextDate),
        to: endOfMonth(nextDate),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addMonths(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = subMonths(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      return this.createDateRange(currentDate);
    }

    generateLabel(date?: DateRange) {
      if (this.showDescription) {
        return this.description;
      }

      if (date?.from) {
        return format(date.from, "MMMM 'de' y", { locale: pt });
      }

      return "...";
    }
  },
  class extends Filter {
    id: FilterId = "lastMonth";
    description = "Mês passado";

    private canShowDescription({ from }: DateRange) {
      return isSameMonth(from!, subMonths(new Date(), 1));
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: startOfMonth(nextDate),
        to: endOfMonth(nextDate),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addMonths(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = subMonths(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || subMonths(new Date(), 1);
      return this.createDateRange(currentDate);
    }

    generateLabel(date?: DateRange) {
      if (this.showDescription) {
        return this.description;
      }

      if (date?.from) {
        return format(date.from, "MMMM 'de' y", { locale: pt });
      }

      return "...";
    }
  },
  class extends Filter {
    id: FilterId = "year";
    description = "Este ano";

    private canShowDescription({ from }: DateRange) {
      return isSameYear(from!, new Date());
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: startOfYear(nextDate),
        to: endOfYear(nextDate),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addYears(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = subYears(currentDate, 1);
      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      return this.createDateRange(currentDate);
    }

    generateLabel(date?: DateRange) {
      if (this.showDescription) {
        return this.description;
      }

      if (date?.from) {
        return format(date.from, "y", { locale: pt });
      }

      return "...";
    }
  },
  class extends Filter {
    id: FilterId = "last30days";
    description = "Últimos 30 dias";

    private canShowDescription({ from, to }: DateRange) {
      return (
        isSameDay(from!, subDays(new Date(), 30)) && isSameDay(to!, new Date())
      );
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: nextDate,
        to: endOfDay(addDays(nextDate, 30)),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      this.showDescription = isSameMonth(date?.from!, new Date());
      const currentDate = date?.from || new Date();
      const nextDate = addDays(currentDate, 30);

      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      this.showDescription = isSameMonth(date?.from!, new Date());
      const currentDate = date?.from || new Date();
      const nextDate = subDays(currentDate, 30);

      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = subDays(currentDate, 30);

      return this.createDateRange(nextDate);
    }
  },
  class extends Filter {
    id: FilterId = "last12month";
    description = "Últimos 12 meses";

    private canShowDescription({ from, to }: DateRange) {
      return (
        isSameDay(from!, subMonths(new Date(), 12)) &&
        isSameDay(to!, new Date())
      );
    }

    private createDateRange(nextDate: Date) {
      const dateRange = {
        from: nextDate,
        to: endOfDay(addMonths(nextDate, 12)),
      };

      this.showDescription = this.canShowDescription(dateRange);

      return dateRange;
    }

    nextPeriod(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      const nextDate = addMonths(currentDate, 12);
      return this.createDateRange(nextDate);
    }

    prevPeriod(date?: DateRange): DateRange {
      this.showDescription = false;
      const currentDate = date?.from || new Date();
      const nextDate = subMonths(currentDate, 12);
      return this.createDateRange(nextDate);
    }

    onSelected(date?: DateRange): DateRange {
      const currentDate = date?.from || new Date();
      return this.createDateRange(subMonths(startOfDay(currentDate), 12));
    }
  },
  class extends Filter {
    id: FilterId = "custom";
    description = "Período personalizado";
    showDescription = false;
  },
);
export { ManagerFilter };
