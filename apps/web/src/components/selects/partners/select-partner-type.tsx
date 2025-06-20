import type { InputDefaultProps } from "@/components/type";
import { PARTNER_TYPE } from "@/constants";
import { Select } from "../common/select";

type Props = InputDefaultProps;

export const SelectPartnerType: React.FC<Props> = (props) => {
  return (
    <Select
      className="w-60"
      options={PARTNER_TYPE}
      label="label"
      value="value"
      selected={
        PARTNER_TYPE.find((option) => option.value === props.value) || null
      }
      onSelect={(option) => {
        props.onChange(option ? option.value : null);
      }}
      noAddButton
      noSearchInput
      noClearButton
    />
  );
};
