"use client";

import { ModalRegisterPartner } from "@/components/modais/partners/modal-register-partner";
import { Toaster } from "@/components/ui/sonner";
// import dynamic from "next/dynamic";
import type { FC, ReactNode } from "react";

// const ModalRegisterPartner = dynamic(
//   async () =>
//     import("@/components/modais/partners/modal-register-partner").then(
//       (component) => component.ModalRegisterPartner,
//     ),
//   {
//     ssr: false,
//   },
// );
// const ModalPaymentTransaction = dynamic(
//   async () =>
//     import("@/components/modais/transactions/modal-payment-transaction").then(
//       (component) => component.ModalPaymentTransaction,
//     ),
//   {
//     ssr: false,
//   },
// );
// const ModalRegisterTransaction = dynamic(
//   async () =>
//     import("@/components/modais/transactions/modal-register-transaction").then(
//       (component) => component.ModalRegisterTransaction,
//     ),
//   {
//     ssr: false,
//   },
// );
// const ModalSearchTransaction = dynamic(
//   async () =>
//     import("@/components/modais/transactions/modal-search-transaction").then(
//       (component) => component.ModalSearchTransaction,
//     ),
//   {
//     ssr: false,
//   },
// );
// const ModalRegisterWallet = dynamic(
//   async () =>
//     import("@/components/modais/wallets/modal-register-wallet").then(
//       (component) => component.ModalRegisterWallet,
//     ),
//   {
//     ssr: false,
//   },
// );

export const Globals: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <ModalRegisterPartner />
      {/* <ModalRegisterTransaction />
      <ModalPaymentTransaction />
      <ModalRegisterWallet />
      <ModalSearchTransaction /> */}
      <Toaster />
    </>
  );
};
