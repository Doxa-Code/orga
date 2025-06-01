import { Breadcrumb } from "@/components/breadcrumb";
import { HeaderPartners } from "@/components/header-partners";
import TablePartners from "@/components/table-partners";
import { Home } from "lucide-react";
import { listPartners } from "./actions";

export default async function ClientsPage() {
  const [partners] = await listPartners();

  return (
    <main className="flex flex-col gap-4">
      <Breadcrumb routes={["Clientes"]} />
      <HeaderPartners />
      <TablePartners partners={partners ?? []} />
    </main>
  );
}
