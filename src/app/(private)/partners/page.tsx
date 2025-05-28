import { HeaderPartners } from "@/components/header-partners";
import TablePartners from "@/components/table-partners";
import { Heading } from "@/components/typograph";
import { listPartners } from "./actions";

export default async function ClientsPage() {
  const [partners] = await listPartners();

  return (
    <main className="flex flex-col gap-4">
      <Heading level={1}>Clientes</Heading>
      <HeaderPartners />
      <TablePartners partners={partners ?? []} />
    </main>
  );
}
