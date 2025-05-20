import { listPartnersLikeOption } from "@/app/actions/partners";
import { useServerActionQuery } from "@/app/actions/query-key-factory";
import type { InputDefaultProps } from "@/components/type";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import { useModais } from "@/hooks/use-modais";
import type { TypeListPartners } from "@orga/core/application";
import { Select } from "../common/select";

type Props = {
  type: TypeListPartners;
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
      label="name"
      value="partnerId"
      options={listPartnerOptionAction.data}
      setSelected={props.onChange}
      selected={props.value}
      onAdd={() => toggleModalName(REGISTER_PARTNER_MODAL_NAME)}
    />
  );
};
