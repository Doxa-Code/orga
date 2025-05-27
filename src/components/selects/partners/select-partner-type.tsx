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
			selected={props.value}
			setSelected={(type) => {
				props.onChange(type);
			}}
			noAddButton
			noSearchInput
			noClearButton
		/>
	);
};
