import { retrievePartnerByTaxId } from "@/app/actions/partners";
import { ButtonLoading } from "@/components/buttons/common/button-loading";
import type { PartnerRetrievedOutputDTO } from "@orga/core/application";
import type { PartnerType } from "@orgadomain";
import type React from "react";
import { useServerAction } from "zsa-react";
import { InputTaxId } from "./input-taxid";

type Props = {
  type: PartnerType;
  onChange?: (value: string) => void;
  value?: string;
  onRetrievedPartnerByTaxId(partner?: PartnerRetrievedOutputDTO | null): void;
};

export const InputLoadByTaxId: React.FC<Props> = (props) => {
  const retrievePartnerByTaxIdAction = useServerAction(retrievePartnerByTaxId);

  const onRetrievePartnerByTaxId = async () => {
    const taxId = props.value;
    if (!taxId) {
      return;
    }

    const [partner] = await retrievePartnerByTaxIdAction.execute({
      taxId,
    });

    props.onRetrievedPartnerByTaxId(partner as PartnerRetrievedOutputDTO);
  };

  return (
    <div className="flex">
      <InputTaxId className="w-full rounded-r-none" {...props} />
      <ButtonLoading
        isLoading={!!retrievePartnerByTaxIdAction.isPending}
        onClick={onRetrievePartnerByTaxId}
        text="Buscar dados"
      />
    </div>
  );
};
