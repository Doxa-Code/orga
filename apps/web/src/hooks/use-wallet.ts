import { Wallet } from "@/core/domain/entities/wallet";
import { create } from "zustand";

type Store = {
  walletId: string | null;
  typeToCreate: Wallet.Type;
  isLoading: boolean;
  wallet: Omit<Wallet, "transactionHistory"> | null;
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
