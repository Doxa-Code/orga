import type { WalletRaw } from "@orga/core/application";
import type { Wallet } from "@orgadomain";
import { create } from "zustand";

type Store = {
  walletId: string | null;
  typeToCreate: Wallet.Type;
  isLoading: boolean;
  wallet: Omit<WalletRaw, "transactionHistory"> | null;
};

type Actions = {
  set(value: Partial<Store>): void;
};

type WalletStore = Actions & Store;

export const useWallet = create<WalletStore>((set) => ({
  set,
  walletId: null,
  typeToCreate: "OTHERS",
  isLoading: false,
  wallet: null,
}));
