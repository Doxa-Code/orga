import { Proposal } from "@/core/domain/entities/proposal";

export const PAYLOAD_KEY_TOKEN = "X-Orga-Payload";
export const REGISTER_TRANSACTION_MODAL_NAME = "register-transaction";
export const REGISTER_PARTNER_MODAL_NAME = "register-partner";
export const REGISTER_WALLET_MODAL_NAME = "register-wallet";
export const SEARCH_TRANSACTION_MODAL_NAME = "search-transaction";
export const PAYMENT_TRANSACTION_MODAL_NAME = "payment-transaction";
export const PAYMENT_METHOD = [
  {
    name: "Cartão de Crédito",
  },
  {
    name: "Cartão de Débito",
  },
  {
    name: "Pix",
  },
  {
    name: "Transferência bancária",
  },
  {
    name: "Dinheiro",
  },
  {
    name: "Cheque",
  },
  {
    name: "Boleto",
  },
  {
    name: "Outros",
  },
];
export const PAYMENT_CONDITION = [{ label: "À vista", value: 1 }].concat(
  Array.from({ length: 59 }).map((_, i) => ({
    label: `${i + 2}x`,
    value: i + 2,
  }))
);
export const FILTER_TRANSACTIONS = [
  { label: "Contas a pagar", value: "DEBIT" },
  { label: "Contas a receber", value: "CREDIT" },
];
export const PARTNER_TYPE = [
  { label: "Jurídica", value: "COMPANY" },
  { label: "Física", value: "INDIVIDUAL" },
];

export const PARTNER_ROLE = [
  { value: "CUSTOMER", label: "Cliente" },
  { value: "SUPPLIER", label: "Fornecedor" },
];
