import TableClients from "@/components/table-clients";
import { Heading } from "@/components/typograph";
import { listClients } from "./actions";

export default async function ClientsPage() {
  const [clients] = await listClients();
  return (
    <main className="flex flex-col gap-4">
      <Heading level={1}>Cliente</Heading>
      <TableClients clients={clients} />
    </main>
  );
}
