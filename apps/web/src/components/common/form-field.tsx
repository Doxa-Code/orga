"use client";
import {
  FormControl,
  FormDescription,
  FormField as FormFieldBase,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  hidden?: boolean;
  form?: UseFormReturn<any>;
  description?: string | ReactNode;
  required?: boolean;
  className?: string;
  preventDefault?: boolean;
  disabled?: boolean;
  children: (field: ControllerRenderProps<any, string>) => ReactNode;
};

export const FormField: React.FC<Props> = ({ form, ...props }) => {
  return (
    <FormFieldBase
      control={form?.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem data-hidden={props.hidden} className={props.className}>
            <FormLabel className={cn(props.required && "required")}>
              {props.label}
            </FormLabel>
            <FormControl>
              {typeof props.children === "function" && props.children?.(field)}
            </FormControl>
            <FormMessage />
            <FormDescription>{props.description}</FormDescription>
          </FormItem>
        );
      }}
    />
  );
};
