import { listBank } from "@/app/actions/finance-entities";
import {
  QueryKeyFactory,
  useServerActionQuery,
} from "@/app/actions/query-key-factory";
import { Paragraph } from "@/components/common/typograph";
import type { InputDefaultProps } from "@/components/type";
import Image from "next/image";
import { Select } from "./select";

type Props = InputDefaultProps;

export const SelectBank: React.FC<Props> = (props) => {
  const { data: banks } = useServerActionQuery(listBank, {
    input: undefined,
    queryKey: QueryKeyFactory.listBank(),
    enabled: typeof window !== "undefined",
  });

  return (
    <Select
      className="w-60 h-10"
      render={(bank) => (
        <div className="flex items-center gap-2">
          <Image
            width={1000}
            height={1000}
            src={bank.thumbnail}
            alt={bank.name}
            className="h-6 w-6 rounded-md bg-cover bg-center"
          />
          <div>
            <Paragraph className="text-sm">{bank.name}</Paragraph>
          </div>
        </div>
      )}
      options={banks}
      label="name"
      value="code"
      selected={props.value as any}
      onSelect={(bankCode) => {
        props.onChange(bankCode);
      }}
      noAddButton
    />
  );
};
