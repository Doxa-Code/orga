"use client";

import { registerPartner } from "@/app/actions/partners";
import { registerPartnerFormSchema } from "@/app/actions/partners/schema";
import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { AccordionAddressSession } from "@/components/accordion/common/accordion-address-session";
import { AccordionBase } from "@/components/accordion/common/accordion-base";
import { CheckboxPartnerRoleInputForm } from "@/components/checkboxes/partners/checkbox-partner-role-input-form";
import { FormDefault } from "@/components/forms/common/form-default";
import { PhoneInputForm } from "@/components/inputs/common/phone-input-form";
import { TaxIdLoaderInputForm } from "@/components/inputs/common/tax-id-loader-input-form";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { SectionModal } from "@/components/modais/common/section-modal";
import { SelectPartnerTypeInputForm } from "@/components/selects/partners/select-partner-type-input-form";
import { FormRegisterPartnerSkeleton } from "@/components/skeletons/partners/form-register-partner-skeleton";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useFormSchema } from "@/hooks/use-form-schema";
import { usePartner } from "@/hooks/use-partner";
import { useToast } from "@/hooks/use-toast";
import { formatPhone, formatTaxId } from "@orga";
import type { PartnerRetrievedOutputDTO } from "@orga/core/application";
import type { Address } from "@orgadomain";
import { PartnerType } from "@orgadomain";
import { forwardRef } from "react";

type Props = {
  onFinish(): void;
};

export const FormRegisterPartner = forwardRef<FormHandlesRef, Props>(
  (props) => {
    const { partnerId, roleToCreate } = usePartner();
    const isPending = false;
    const { toast } = useToast();
    const registerPartnerAction = useServerActionMutation(registerPartner, {
      mutationKey: ["register-partner"],
      onSuccess() {
        props.onFinish();
      },
      onError(error) {
        toast({
          description: error.name,
          title: error.message,
          variant: "destructive",
        });
      },
    });

    const form = useFormSchema({
      schema: registerPartnerFormSchema,
      defaultValues: {
        address: {
          city: "",
          country: "",
          number: "",
          state: "",
          street: "",
          zipCode: "",
        },
        email: "",
        name: "",
        phone: "",
        roles: [roleToCreate].filter(Boolean),
        taxId: "",
        type: PartnerType.COMPANY,
      },
    });

    form.watch(async (values) => {
      if (values.roles?.length! <= 0) {
        form.setValue("roles", [roleToCreate!].filter(Boolean));
      }
    });

    const onRetrievedAddressByZipCode = (address?: Address | null) => {
      if (!address) {
        form.reset({
          ...form.getValues(),
          address: {
            ...form.getValues().address,
            city: "",
            country: "",
            neighborhood: "",
            note: "",
            number: "",
            state: "",
            street: "",
          },
        });
        return;
      }

      form.reset({
        ...form.getValues(),
        address: {
          city: address.city!,
          country: address.country!,
          neighborhood: address.neighborhood!,
          note: address.note!,
          number: address.number!,
          state: address.state!,
          street: address.street!,
          zipCode: address.zipCode!,
        },
      });
    };

    const onRetrievedPartnerByTaxId = (
      partner?: PartnerRetrievedOutputDTO | null,
    ) => {
      if (!partner) {
        form.reset({
          ...form.getValues(),
          address: {
            city: "",
            country: "",
            neighborhood: "",
            note: "",
            number: "",
            state: "",
            street: "",
            zipCode: "",
          },
          email: "",
          name: "",
          phone: "",
        });
        return;
      }
      form.reset({
        ...partner,
        phone: formatPhone(partner.phone),
        taxId: formatTaxId(partner.taxId, partner.type),
      });
    };

    if (isPending && partnerId) {
      return <FormRegisterPartnerSkeleton />;
    }

    return (
      <FormDefault
        form={form}
        onSubmit={form.handleSubmit((values) =>
          registerPartnerAction.mutate({
            ...values,
          }),
        )}
        id={REGISTER_PARTNER_MODAL_NAME}
      >
        <SectionModal title="Dados gerais">
          <div className="flex w-full gap-6">
            <SelectPartnerTypeInputForm name="type" label="Tipo de pessoa" />
            <TaxIdLoaderInputForm
              name="taxId"
              onRetrievedPartnerByTaxId={onRetrievedPartnerByTaxId}
            />
            <TextInputForm
              label={
                form.getValues().type === PartnerType.COMPANY
                  ? "Nome fantasia"
                  : "Nome"
              }
              name="name"
              className="w-full"
            />
          </div>
          <CheckboxPartnerRoleInputForm name="roles" label="Tipo de papel" />
          <AccordionBase
            title="Informações adicionais"
            id="information-additional"
          >
            <div className="flex w-full gap-4">
              <TextInputForm label="Email" name="email" className="w-full" />
              <PhoneInputForm name="phone" label="Telefone/Celular" />
            </div>
          </AccordionBase>
          <AccordionAddressSession
            onRetrievedAddressByZipCode={onRetrievedAddressByZipCode}
          />
        </SectionModal>
      </FormDefault>
    );
  },
);
