"use client";

import { registerPartner } from "@/app/actions/partners";
import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { AccordionAddressSession } from "@/components/accordion/common/accordion-address-session";
import { AccordionBase } from "@/components/accordion/common/accordion-base";
import { CheckboxPartnerRoleInputForm } from "@/components/checkboxes/partners/checkbox-partner-role-input-form";
import { FormFooter } from "@/components/form-footer";
import { FormDefault } from "@/components/forms/common/form-default";
import { PhoneInputForm } from "@/components/inputs/common/phone-input-form";
import { TaxIdLoaderInputForm } from "@/components/inputs/common/tax-id-loader-input-form";
import { TextInputForm } from "@/components/inputs/common/text-input.form";
import { SectionModal } from "@/components/modais/common/section-modal";
import { SelectPartnerTypeInputForm } from "@/components/selects/partners/select-partner-type-input-form";
import { FormRegisterPartnerSkeleton } from "@/components/skeletons/partners/form-register-partner-skeleton";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import type { PartnerRetrievedOutputDTO } from "@/core/application/DAO/retrieve-partner-by-tax-id";
import type { Partner } from "@/core/domain/entities/partner";
import type { Address } from "@/core/domain/valueobjects/address";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useModais } from "@/hooks/use-modais copy";
import { usePartner } from "@/hooks/use-partner";
import { useToast } from "@/hooks/use-toast";
import { formatPhone, formatTaxId } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { z } from "zod";

export const registerPartnerFormSchema = z.object({
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  roles: z.array(z.enum(["CUSTOMER", "SUPPLIER"])).min(1, {
    message: "Preecha pelo menos 1 tipo",
  }),
  name: z.string().min(2, { message: "Deve ter no mínimo 2 caracteres" }),
  taxId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    note: z.string().optional(),
  }),
});

type Props = {
  onFinish(): void;
};

export const FormRegisterPartner = forwardRef<FormHandlesRef, Props>(
  (props, ref) => {
    const [type, setType] = useState<Partner.Type>("COMPANY");
    const { partnerId, roleToCreate } = usePartner();
    const isPending = false;
    const { toast } = useToast();
    const { closeModal } = useModais();
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
        type: "COMPANY",
      },
    });

    form.watch(async (values) => {
      setType(values.type ?? "COMPANY");
      if (!values.roles?.length) {
        form.setValue("roles", [roleToCreate].filter(Boolean));
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
          city: address.city,
          country: address.country,
          neighborhood: address.neighborhood,
          note: address.note,
          number: address.number,
          state: address.state,
          street: address.street,
          zipCode: address.zipCode,
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
        ref={ref as any}
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
              form={form}
              type={type}
            />
            <TextInputForm
              label={
                form.getValues().type === "COMPANY" ? "Nome fantasia" : "Nome"
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
        <FormFooter
          onCancel={() => {
            closeModal(REGISTER_PARTNER_MODAL_NAME);
          }}
        />
      </FormDefault>
    );
  },
);
