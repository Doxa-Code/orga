import type { Partner } from "@/core/domain/entities/partner";
import { create } from "zustand";

type Store = {
  partnerId: string | null;
  roleToCreate?: Partner.Role;
};

type Action = {
  set(values: Partial<Store>): void;
};

type PartnerStore = Store & Action;

export const usePartner = create<PartnerStore>((set) => ({
  partnerId: null,
  roleToCreate: "CUSTOMER",
  set,
}));
