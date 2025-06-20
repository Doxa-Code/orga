import { endOfMonth, startOfMonth } from "date-fns";
import {
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { createSearchParamsCache } from "nuqs/server";

const DEFAULT_PARAMS = {
  search: parseAsString,
  from: parseAsIsoDateTime.withDefault(startOfMonth(new Date())),
  to: parseAsIsoDateTime.withDefault(endOfMonth(new Date())),
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
  walletId: parseAsString,
};

export const useQueryStateWallets = () => {
  const [{ search, filterDateId, walletId, ...period }, setFilters] =
    useQueryStates(DEFAULT_PARAMS, {
      shallow: false,
    });

  return {
    search,
    filterDateId,
    period,
    walletId,
    setFilters,
  };
};

export const searchParamsWallets = createSearchParamsCache(DEFAULT_PARAMS);
