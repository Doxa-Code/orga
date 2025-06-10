import { Kanban } from "lucide-react";
import { Module } from "./module";
import { SidebarItem } from "./sidebar-item";
import { ReactNode } from "react";

export const modules: Module[] = [
  Module.create(
    "Dashboard",
    "Dashboard",
    "/dashboard",
    "Visão do resumo geral da saúde financeira"
  ),
  Module.create(
    "CRM",
    Kanban as unknown as ReactNode,
    "/crm",
    "Relacionamento com o cliente"
  ),
  Module.create(
    "Contas e carteiras",
    "Wallet",
    "/wallets",
    "Cadastro de contas e carteiras"
  ),
  Module.create(
    "Transações",
    "Transactions",
    "/transactions",
    "Gerenciar contas a pagar e contas a receber"
  ),
  Module.create(
    "Clientes",
    "Clients",
    "/partners",
    "Criar, excluir, alterar, visualizar todos os clientes e fornecedores"
  ),
];

export function Sidebar() {
  return (
    <aside className="flex flex-1 flex-col pt-5 border-r max-w-[80px] border-[#EAEDEE] bg-white w-full gap-4">
      {modules.map((mod, index) => (
        <SidebarItem module={mod} key={index!} />
      ))}
    </aside>
  );
}
