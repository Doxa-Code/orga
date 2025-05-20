import { PARTNER_ROLE } from "@/constants";
import { cn } from "@orga";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@orga/ui/form";
import type { InputFormDefaultProps } from "../../type";
import { PartnerRoleCheckbox } from "./partner-role-checkbox";

export const CheckboxPartnerRoleInputForm: React.FC<InputFormDefaultProps> = ({
  form,
  ...props
}) => {
  return (
    <div data-hidden={props.hidden} className="space-y-3 w-60">
      <FormLabel className={cn(props.required ?? "required")}>
        {props.label || "Tipo de papel"}
      </FormLabel>
      <div className="flex w-full justify-between gap-6">
        {PARTNER_ROLE.map((item) => (
          <FormField
            key={item.label}
            control={form?.control}
            name={props.name}
            render={({ field }) => {
              return (
                <FormItem
                  key={item.value}
                  className="flex flex-row items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <PartnerRoleCheckbox
                      onChange={field.onChange}
                      roles={field.value}
                      value={item.value}
                    />
                  </FormControl>
                  <FormLabel>{item.label}</FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
      <FormDescription className="text-xs">
        {props.description || "Selecione mais que um se necessário"}
      </FormDescription>
    </div>
  );
};
