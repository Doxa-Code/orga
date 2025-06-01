import { Breadcrumb } from "@/components/breadcrumb";
import { Kanban } from "@/components/crm/kanban";

export default async function ClientsPage() {
  return (
    <main className="flex flex-col flex-1 gap-4">
      <Breadcrumb routes={["CRM"]} />
      <Kanban />
    </main>
  );
}
