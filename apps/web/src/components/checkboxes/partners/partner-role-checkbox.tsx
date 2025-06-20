import { Checkbox } from "@/components/ui/checkbox";
import type { Partner } from "@/core/domain/entities/partner";

type Props = {
  roles: Partner.Role[];
  value: Partner.Role;
  onChange(roles: Partner.Role[]): void;
};

export const PartnerRoleCheckbox: React.FC<Props> = (props) => {
  return (
    <Checkbox
      id={props.value}
      checked={props.roles?.includes(props.value)}
      onCheckedChange={(checked) => {
        props.onChange(
          Array.from(
            new Set(
              checked
                ? [...props.roles, props.value]
                : props.roles?.filter((value) => value !== props.value),
            ).values(),
          ),
        );
      }}
    />
  );
};
