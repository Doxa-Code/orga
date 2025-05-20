import { MainPage } from "@/components/common/main-page";
import { Skeleton } from "@orga/ui/skeleton";

export default function Loading() {
  return (
    <MainPage>
      <div className="w-full flex flex-col py-2 gap-4 items-start">
        <Skeleton className="w-[182px] h-[40px]" />
        <Skeleton className="w-full h-[300px]" />
      </div>
    </MainPage>
  );
}
