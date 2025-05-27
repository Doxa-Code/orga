import { listCities } from "@/app/actions/address";
import type { InputDefaultProps } from "@/components/type";
import { compareStrings } from "@/lib/utils";
import { useEffect } from "react";
import { useServerAction } from "zsa-react";
import { Select } from "../common/select";

type Props = InputDefaultProps & {
	acronym?: string;
};

export const SelectCities: React.FC<Props> = (props) => {
	const listCitiesAction = useServerAction(listCities);

	useEffect(() => {
		if (props.acronym) {
			listCitiesAction.execute({ acronym: props.acronym });
		}
	}, [props.acronym]);

	return (
		<Select
			disabled={listCitiesAction.data?.length! <= 0}
			className="w-60"
			options={listCitiesAction.data}
			label="name"
			value="name"
			selected={
				listCitiesAction.data?.find((c: any) =>
					String(props.value)
						? compareStrings(c.name, String(props.value))
						: false,
				)?.name || ""
			}
			setSelected={(city) => props.onChange(city)}
			noAddButton
		/>
	);
};
