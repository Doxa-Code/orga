import { listCities } from "@/app/actions/address";
import type { InputDefaultProps } from "@/components/type";
import { useEffect } from "react";
import { useServerAction } from "zsa-react";
import { Select } from "./select";
import { compareStrings } from "@/lib/utils";

type Props = InputDefaultProps & {
  acronym?: string;
};

export const SelectCities: React.FC<Props> = (props) => {
  const listCitiesAction = useServerAction(listCities);

  useEffect(() => {
    listCitiesAction.execute({ acronym: props.acronym });
  }, [props.acronym]);

  return (
    <Select
      disabled={listCitiesAction.data?.length! <= 0}
      className="w-60"
      options={listCitiesAction.data}
      isSearching={listCitiesAction.isPending}
      label="name"
      value="name"
      selected={
        listCitiesAction.data?.find((c: { name: string }) =>
          compareStrings(c.name, String(props.value))
        ) ?? null
      }
      onSelect={(city) => props.onChange(city?.name ?? "")}
      noAddButton
    />
  );
};
