import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

declare const $NestedValue: unique symbol;
type ExtractObjects<T> = T extends infer U
  ? U extends object
    ? U
    : never
  : never;
type FieldValues = Record<string, any>;
type BrowserNativeObject = Date | FileList | File;
type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never;
} & TValue;
type DeepPartial<T> = T extends BrowserNativeObject | NestedValue
  ? T
  : {
      [K in keyof T]?: ExtractObjects<T[K]> extends never
        ? T[K]
        : DeepPartial<T[K]>;
    };
type DefaultValues<TFieldValues> =
  TFieldValues extends AsyncDefaultValues<TFieldValues>
    ? DeepPartial<Awaited<TFieldValues>>
    : DeepPartial<TFieldValues>;

type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown,
) => Promise<TFieldValues>;

type Props<T extends FieldValues = FieldValues> = {
  schema: z.Schema<T>;
  defaultValues?: DefaultValues<T> | AsyncDefaultValues<T>;
};

export const useFormSchema = <T extends FieldValues = FieldValues>(
  props: Props<T>,
) => {
  return useForm<z.infer<typeof props.schema>>({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultValues as any,
  });
};
