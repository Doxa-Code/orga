import { Skeleton } from "@/components/ui/skeleton";

export const FormRegisterTransactionSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-4">
      <Skeleton className="flex h-[254px] w-full flex-col gap-3 border bg-white p-5">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="w-full flex-1" />
      </Skeleton>
      <Skeleton className="flex h-[366px] w-full flex-col gap-3 border bg-white p-5">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="w-full flex-1" />
        <Skeleton className="w-full flex-1" />
      </Skeleton>
    </div>
  );
};
