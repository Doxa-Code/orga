"use client";

import { Paragraph } from "@/components/common/typograph";
import { cn } from "@orga";
import { Label } from "@orga/ui/label";

type Props = {
  label: string;
  value?: string;
  className?: string;
  "data-negative"?: boolean;
  "data-positive"?: boolean;
};

export const Field: React.FC<Props> = (props) => {
  return (
    <div className={cn("w-full", props.className)}>
      <Label>{props.label}</Label>
      <Paragraph {...props}>{props.value}</Paragraph>
    </div>
  );
};
