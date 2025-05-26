import { Logo } from "@/components/typograph";
import { ScrollArea } from "../ui/scroll-area";
import { Module } from "./module";
import { SidebarItem } from "./sidebar-item";

export const modules: Module[] = [
  Module.create("Overview", "Dashboard").addSubModule(
    Module.create(
      "Dashboard",
      "Dashboard",
      "/dashboard",
      "Visão do resumo geral da saúde financeira",
    ),
  ),
  Module.create("Financeiro", "Finance").addSubModule(
    // Module.create(
    //   "Vendas",
    //   "Sale",
    //   "/sales",
    //   "Criar, excluir, alterar, visualizar todas as vendas",
    // ),
    Module.create(
      "Contas e carteiras",
      "Wallet",
      "/wallets",
      "Cadastro de contas e carteiras",
    ),
    Module.create(
      "Transações",
      "Transactions",
      "/transactions",
      "Gerenciar contas a pagar e contas a receber",
    ),
  ),
  // Module.create("Relatórios", "Report").addSubModule(
  //   Module.create(
  //     "Relatório de vendas",
  //     "ReportSales",
  //     "/reports/sales",
  //     "Visualizar relatória de vendas",
  //   ),
  // ),
  // Module.create("Operacional", "Operational").addSubModule(
  //   Module.create(
  //     "Agendamento",
  //     "Schedule",
  //     "/schedules",
  //     "Módulo de agendamento",
  //   ),
  //   Module.create("Orçamentos", "Orga", "/orgas", "Módulo de agendamento"),
  //   Module.create(
  //     "Estoque",
  //     "Stock",
  //     "/stock",
  //     "Visualizar e registar entradas no estoque dos produtos",
  //   ),
  // ),
  Module.create("Cadastros", "Register").addSubModule(
    Module.create(
      "Clientes",
      "Clients",
      "/clients",
      "Criar, excluir, alterar, visualizar todos os clientes",
    ),
    //   Module.create(
    //     "Fornecedores",
    //     "Provider",
    //     "/providers",
    //     "Criar, excluir, alterar, visualizar todas os fornecedores",
    //   ),
    //   Module.create(
    //     "Serviços",
    //     "Service",
    //     "/services",
    //     "Criar, excluir, alterar, visualizar todas os serviços",
    //   ),
    //   Module.create(
    //     "Produtos",
    //     "Product",
    //     "/products",
    //     "Criar, excluir, alterar, visualizar todas os produtos",
    //   ),
    //   Module.create(
    //     "Patrimônio",
    //     "Property",
    //     "/properties",
    //     "Criar, excluir, alterar, visualizar todas os patrimônios",
    //   ),
  ),
];

export function Sidebar() {
  return (
    <ScrollArea>
      <div className="px-4 sticky bg-white top-0 py-8">
        <Logo className="text-2xl text-primary">Orga</Logo>
        <Logo className="text-2xl text-secondary">Saas</Logo>
      </div>

      <aside className="flex flex-1 flex-col gap-4 pt-4 pb-10">
        {modules.map((mod, index) => (
          <SidebarItem module={mod} key={index!} />
        ))}
      </aside>
    </ScrollArea>
  );
}
