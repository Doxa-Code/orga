import { HeaderPartners } from "@/components/header-partners";
import TablePartners from "@/components/table-partners";

export default async function ClientsPage() {
  return (
    <main className="flex flex-col w-full gap-4 p-10">
      <HeaderPartners />
      <TablePartners />
    </main>
  );
}
