import { listPartnersLikeOption } from "@/app/actions/partners";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import { Select } from "../common/select";

type Props = {
  type: any;
} & InputDefaultProps;

export const SelectPartner: React.FC<Props> = (props) => {
  const { toggleModalName } = useModais();
  const listPartnerOptionAction = useServerActionQuery(listPartnersLikeOption, {
    input: {
      type: props.type,
    },
    queryKey: ["listPartnersLikeOption"],
  });

  return (
    <Select
      className="w-full"
      options={listPartnerOptionAction.data?.map((partner) => partner.name)}
      onSelect={props.onChange}
      selected={props.value as any}
      onAdd={() => toggleModalName(REGISTER_PARTNER_MODAL_NAME)}
      noAddButton
    />
  );
};
