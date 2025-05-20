import { loadAddressZipCode } from "@/app/actions/address";
import { ButtonLoading } from "@/components/buttons/common/button-loading";
import type { Address } from "@orga/core/domain";
import { Input } from "@orgaput";
import type React from "react";
import type { ChangeEvent } from "react";
import { useServerAction } from "zsa-react";

type Props = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onRetrievedAddressByZipCode: (address?: Address | null) => void;
};

export const InputLoadByZipCode: React.FC<Props> = (props) => {
  const loadAddressZipCodeAction = useServerAction(loadAddressZipCode);

  const onRetrievePartnerByTaxId = async () => {
    const zipCode = props.value;
    if (!zipCode) {
      return;
    }

    const [address] = await loadAddressZipCodeAction.execute({
      zipCode,
    });

    props.onRetrievedAddressByZipCode(address as Address);
  };

  return (
    <div className="flex">
      <Input
        {...props}
        type="text"
        className="w-full min-w-44 rounded-r-none"
      />
      <ButtonLoading
        isLoading={!!loadAddressZipCodeAction.isPending}
        onClick={onRetrievePartnerByTaxId}
        text="Buscar dados"
      />
    </div>
  );
};
