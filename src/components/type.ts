import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

export type InputFormDefaultProps = {
  name: string;
  label?: string;
  hidden?: boolean;
  form?: UseFormReturn<any>;
  description?: string | ReactNode;
  required?: boolean;
  className?: string;
  preventDefault?: boolean;
  disabled?: boolean;
};

export type InputDefaultProps = {
  value?: string | number | null;
  onChange(value: string | number | null | undefined): void;
};
