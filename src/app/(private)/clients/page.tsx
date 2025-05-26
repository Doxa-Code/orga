import TableClients from "@/components/table-clients";
import { Heading } from "@/components/typograph";

export default async function ClientsPage() {
  return (
    <main className="flex flex-col gap-4">
      <Heading level={1}>Cliente</Heading>
      <TableClients />
    </main>
  );
}
