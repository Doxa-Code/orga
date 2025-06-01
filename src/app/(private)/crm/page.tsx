import { Kanban } from "@/components/crm/kanban";

export default async function ClientsPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden gap-4">
      <h1 className="text-[#020304] font-semibold px-4 pt-4 text-xl">CRM</h1>
      <Kanban />
    </main>
  );
}
