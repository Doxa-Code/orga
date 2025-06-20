import { Heading } from "@/components/common/typograph";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string | ReactNode;
  children: ReactNode;
};

export function AccordionBase(props: Props) {
  return (
    <Accordion
      type="single"
      className="w-full px-4 bg-white border rounded border-gray-300"
      collapsible
    >
      <AccordionItem value={props.id} className="!border-b-0">
        <AccordionTrigger className="hover:no-underline">
          <Heading className="text-slate-600" level={2}>
            {props.title}
          </Heading>
        </AccordionTrigger>
        <AccordionContent className="space-y-6">
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
