import { ButtonLoading } from "@/components/buttons/common/button-loading";
import type { PartnerRetrievedOutputDTO } from "@/core/application/DAO/retrieve-partner-by-tax-id";
import type { Partner } from "@/core/domain/entities/partner";
import type React from "react";
import { useServerAction } from "zsa-react";
import { InputTaxId } from "./input-taxid";
import { retrievePartnerByTaxId } from "@/app/actions/partners";

type Props = {
  type: Partner.Type;
  onChange?: (value: string) => void;
  value?: string;
  onRetrievedPartnerByTaxId(partner?: PartnerRetrievedOutputDTO | null): void;
};

export const InputLoadByTaxId: React.FC<Props> = ({
  onRetrievedPartnerByTaxId,
  ...props
}) => {
  const retrievePartnerByTaxIdAction = useServerAction(retrievePartnerByTaxId);

  const onRetrievePartnerByTaxId = async () => {
    const taxId = props.value;
    if (!taxId) {
      return;
    }

    const [partner] = await retrievePartnerByTaxIdAction.execute({
      taxId,
    });

    onRetrievedPartnerByTaxId(partner as PartnerRetrievedOutputDTO);
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
