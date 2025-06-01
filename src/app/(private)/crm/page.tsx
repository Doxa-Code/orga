import { Kanban } from "@/components/crm/kanban";
import { Heading } from "@/components/typograph";

export default async function ClientsPage() {
  return (
    <main className="flex flex-col flex-1 gap-4">
      <Heading level={1}>CRM</Heading>
      <Kanban />
    </main>
  );
}
