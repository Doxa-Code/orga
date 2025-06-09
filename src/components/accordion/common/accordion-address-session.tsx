import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { ZipCodeLoaderInputForm } from "@/components/inputs/common/zip-code-load-input-form";
import { SelectCitiesInputForm } from "@/components/selects/common/select-cities-input-form";
import { SelectStatesInputForm } from "@/components/selects/common/select-states-input-form";
import type { InputFormDefaultProps } from "@/components/type";
import type { Address } from "@/core/domain/valueobjects/address";
import { useEffect, useState } from "react";
import { AccordionBase } from "./accordion-base";

type Props = {
  onRetrievedAddressByZipCode: (address?: Address | null) => void;
} & Omit<InputFormDefaultProps, "name">;

export const AccordionAddressSession: React.FC<Props> = ({
  form,
  ...props
}) => {
  const [acronym, setAcronym] = useState("");

  useEffect(() => {
    if (form) {
      form.watch((values) => {
        setAcronym(values.address.state || "");
      });
    }
  }, [form]);

  return (
    <AccordionBase title="Endereço" id="address">
      <div className="flex w-full gap-4">
        <ZipCodeLoaderInputForm
          name="address.zipCode"
          form={form}
          onRetrievedAddressByZipCode={props.onRetrievedAddressByZipCode}
        />
        <TextInputForm
          label="Logradouro"
          name="address.street"
          className="w-full"
          form={form}
        />
        <TextInputForm label="Numero" name="address.number" form={form} />
      </div>
      <div className="flex w-full gap-4">
        <SelectStatesInputForm name="address.state" form={form} />
        <SelectCitiesInputForm
          name="address.city"
          form={form}
          acronym={acronym}
        />
        <TextInputForm
          label="Bairro"
          name="address.neighborhood"
          className="w-full"
          form={form}
        />
        <TextInputForm
          label="Complemento"
          name="address.note"
          className="w-full"
          form={form}
        />
      </div>
    </AccordionBase>
  );
};
