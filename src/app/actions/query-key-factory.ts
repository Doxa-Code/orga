import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  createServerActionsKeyFactory,
  setupServerActionHooks,
} from "zsa-react-query";

export const QueryKeyFactory = createServerActionsKeyFactory({
  searchTransaction: () => ["searchTransactions"],
  retrievePartner: () => ["retrievePartner"],
  retrieveTransaction: () => ["retrieveTransaction"],
  listFinanceEntities: () => ["listFinanceEntities"],
  listWalletsLikeOption: () => ["listWalletsLikeOption"],
  listBank: (reference?: string) => ["listBank", reference || ""],
  listStates: () => ["listStates"],
  listPartnersLikeOption: () => ["listPartnersLikeOption"],
  listBuckets: () => ["listBuckets"],
  listProposals: () => ["listProposals"],
  listPartners: () => ["listPartners"],
});

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery,
  },
  queryKeyFactory: QueryKeyFactory,
});

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery,
};
