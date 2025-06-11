import {
  createBucketDefault,
  listBuckets,
  listProposals,
} from "@/app/actions/crm";
import { CRMKanban } from "@/components/crm/kanban";

export default async function CRMPage() {
  let [[proposals], [buckets]] = await Promise.all([
    listProposals(),
    listBuckets(),
  ]);

  if (!buckets?.length) {
    [buckets] = await createBucketDefault();
  }

  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <CRMKanban
        initialBuckets={buckets ?? []}
        initialCards={proposals ?? []}
      />
    </main>
  );
}
