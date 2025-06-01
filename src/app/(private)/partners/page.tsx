import { HeaderPartners } from "@/components/header-partners";
import TablePartners from "@/components/table-partners";
import { listPartners } from "./actions";

export default async function ClientsPage() {
  const [partners] = await listPartners();

  return (
    <main className="flex flex-col gap-4 p-10">
      <HeaderPartners />
      <TablePartners partners={partners ?? []} />
    </main>
  );
}
