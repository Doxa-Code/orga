"use client";
import { create } from "zustand";

interface ModaisStore {
  modaisNames: Set<string>;
  toggleModalName(name: string): void;
  openModal(name: string): void;
  clearAll(): void;
  closeModal(name: string): void;
}

export const useModais = create<ModaisStore>((set, get) => ({
  modaisNames: new Set(),
  openModal(name) {
    const { modaisNames } = get();
    modaisNames.add(name);
    set({ modaisNames: new Set(modaisNames) });
  },
  closeModal(name) {
    const { modaisNames } = get();
    modaisNames.delete(name);
    set({ modaisNames: new Set(modaisNames) });
  },
  clearAll() {
    const { modaisNames } = get();
    modaisNames.clear();
    set({ modaisNames: new Set(modaisNames) });
  },
  toggleModalName(name: string) {
    const { modaisNames } = get();
    if (modaisNames.has(name)) {
      modaisNames.delete(name);
    } else {
      modaisNames.add(name);
    }

    set({ modaisNames: new Set(modaisNames) });
  },
}));
