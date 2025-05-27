import { FormField } from "@/components/common/form-field";
import type { InputFormDefaultProps } from "@/components/type";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  label: string;
  className?: string;
} & InputFormDefaultProps;

export const TextInputForm: React.FC<Props> = (props) => {
  return <FormField {...props}>{(field) => <Input {...field} />}</FormField>;
};
