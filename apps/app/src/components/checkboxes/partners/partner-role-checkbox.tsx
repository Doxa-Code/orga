import type { PartnerRole } from "@orga/core/domain";
import { Checkbox } from "@orgaeckbox";

type Props = {
  roles: PartnerRole[];
  value: PartnerRole;
  onChange(roles: PartnerRole[]): void;
};

export const PartnerRoleCheckbox: React.FC<Props> = (props) => {
  return (
    <Checkbox
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
