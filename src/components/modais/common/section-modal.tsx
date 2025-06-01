import { Heading } from "@/components/common/typograph";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function SectionModal(props: Props) {
  return (
    <div
      className={cn(
        "w-full space-y-6 rounded border bg-white p-4",
        props.className,
      )}
    >
      <header
        data-hidden={!props.title}
        className="border-b py-2 data-[hidden=true]:py-0"
      >
        <Heading className="text-slate-600" level={2}>
          {props.title}
        </Heading>
      </header>
      <section className="flex flex-wrap items-start gap-6">
        {props.children}
      </section>
    </div>
  );
}
