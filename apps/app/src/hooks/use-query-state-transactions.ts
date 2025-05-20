import { endOfMonth, startOfMonth } from "date-fns";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { createSearchParamsCache } from "nuqs/server";

const DEFAULT_PARAMS = {
  search: parseAsString,
  walletId: parseAsString,
  from: parseAsIsoDateTime.withDefault(startOfMonth(new Date())),
  to: parseAsIsoDateTime.withDefault(endOfMonth(new Date())),
  selected: parseAsArrayOf(parseAsString).withDefault([]),
  filterTypeTransaction: parseAsStringEnum([
    "CREDIT",
    "DEBIT",
    "TOTAL",
  ]).withDefault("TOTAL"),
  filterDateId: parseAsStringEnum([
    "today",
    "week",
    "lastMonth",
    "month",
    "year",
    "last30days",
    "last12month",
    "custom",
  ]).withDefault("month"),
};

export const useQueryStateTransactions = () => {
  const [{ from, to, ...params }, setFilters] = useQueryStates(DEFAULT_PARAMS, {
    shallow: false,
  });

  return {
    ...params,
    period: {
      from,
      to,
    },
    setFilters,
  };
};

export const searchParamsTransactions = createSearchParamsCache(DEFAULT_PARAMS);
