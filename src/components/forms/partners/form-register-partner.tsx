"use client";

import { registerPartner, retrievePartner } from "@/app/actions/partners";
import {
  QueryKeyFactory,
  useServerActionMutation,
  useServerActionQuery,
} from "@/app/actions/query-key-factory";
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
import { Toast } from "@/components/toast";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import type { PartnerRetrievedOutputDTO } from "@/core/application/DAO/retrieve-partner-by-tax-id";
import type { Partner } from "@/core/domain/entities/partner";
import type { Address } from "@/core/domain/valueobjects/address";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useModais } from "@/hooks/use-modais";
import { usePartner } from "@/hooks/use-partner";
import { formatPhone, formatTaxId } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const registerPartnerFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  roles: z.array(z.enum(["CUSTOMER", "SUPPLIER"])).min(1, {
    message: "Preecha pelo menos 1 tipo",
  }),
  name: z.string().min(2, { message: "Deve ter no mínimo 2 caracteres" }),
  taxId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional().nullish(),
    number: z.string().optional().nullish(),
    neighborhood: z.string().optional().nullish(),
    city: z.string().optional().nullish(),
    state: z.string().optional().nullish(),
    zipCode: z.string().optional().nullish(),
    country: z.string().optional().nullish(),
    note: z.string().optional().nullish(),
  }),
});

type Props = {
  onFinish(): void;
};

export const FormRegisterPartner = forwardRef<FormHandlesRef, Props>(
  (props, ref) => {
    const [type, setType] = useState<Partner.Type>("COMPANY");
    const { partnerId, roleToCreate } = usePartner();
    const { closeModal } = useModais();
    const registerPartnerAction = useServerActionMutation(registerPartner, {
      mutationKey: ["register-partner"],
      onSuccess() {
        props.onFinish();
      },
      onError(error) {
        Toast.error("Erro ao registrar parceiro", error.message);
      },
    });

    const retrievePartnerAction = useServerActionQuery(retrievePartner, {
      input: {
        id: partnerId ?? "",
      },
      queryKey: QueryKeyFactory.retrievePartner(),
      enabled: !!partnerId,
    });

    useEffect(() => {
      if (retrievePartnerAction.data) {
        form.reset(retrievePartnerAction.data);
      }
    }, [retrievePartnerAction.data]);

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

    form.watch((values) => {
      setType(values.type ?? "COMPANY");
      if (!values.roles?.length && roleToCreate) {
        form.setValue("roles", [roleToCreate]);
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
      partner?: PartnerRetrievedOutputDTO | null
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

    if (retrievePartnerAction.isPending && partnerId) {
      return <FormRegisterPartnerSkeleton />;
    }

    return (
      <FormDefault
        ref={ref as any}
        form={form}
        onSubmit={form.handleSubmit((values) =>
          registerPartnerAction.mutate({
            ...values,
            id: partnerId,
          })
        )}
        id={REGISTER_PARTNER_MODAL_NAME}
      >
        <SectionModal title="Dados gerais">
          <div className="flex w-full gap-6">
            <SelectPartnerTypeInputForm
              name="type"
              label="Tipo de pessoa"
              form={form}
            />
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
        </SectionModal>

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
          form={form}
        />
        <FormFooter
          isLoading={registerPartnerAction.isPending}
          onCancel={() => {
            closeModal(REGISTER_PARTNER_MODAL_NAME);
          }}
        />
      </FormDefault>
    );
  }
);
