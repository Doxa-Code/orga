"use client";

import { registerPartner, retrievePartner } from "@/app/actions/partners";
import { registerPartnerFormSchema } from "@/app/actions/partners/schemas";
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
import { ModalDefault } from "@/components/modais/common/modal-default";
import { SelectPartnerTypeInputForm } from "@/components/selects/partners/select-partner-type-input-form";
import { FormRegisterPartnerSkeleton } from "@/components/skeletons/partners/form-register-partner-skeleton";
import { Toast } from "@/components/toast";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import { PartnerRetrievedOutputDTO } from "@/core/application/DAO/retrieve-partner-by-tax-id";
import { Partner } from "@/core/domain/entities/partner";
import { Address } from "@/core/domain/valueobjects/address";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useModais } from "@/hooks/use-modais";
import { usePartner } from "@/hooks/use-partner";
import { formatPhone, formatTaxId } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { SectionModal } from "../common/section-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputPhone } from "@/components/inputs/common/input-phone";
import { Contact } from "@/core/domain/entities/contact";
import { Phone } from "@/core/domain/valueobjects/phone";

export function ModalRegisterPartner() {
  const [contacts, setContacts] = React.useState<Contact[]>([
    Contact.create("", ""),
  ]);
  const { partnerId, roleToCreate } = usePartner();
  const { closeModal } = useModais();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [type, setType] = React.useState<Partner.Type>("COMPANY");
  const registerPartnerAction = useServerActionMutation(registerPartner, {
    mutationKey: ["register-partner"],
    onSuccess() {
      queryClient.invalidateQueries({
        exact: true,
        queryKey: QueryKeyFactory.listPartnersLikeOption(),
      });
      closeModal(REGISTER_PARTNER_MODAL_NAME);
      router.refresh();
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

  React.useEffect(() => {
    if (retrievePartnerAction.data) {
      form.reset(retrievePartnerAction.data);
      setContacts(
        retrievePartnerAction.data.contacts.map((contact) =>
          Contact.instance({
            id: contact.id,
            name: contact.name,
            phone: Phone.create(contact.phone),
          })
        )
      );
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
    return (
      <ModalDefault
        modalName={REGISTER_PARTNER_MODAL_NAME}
        title={partnerId ? "Editar cadastro" : "Novo cadastro"}
      >
        <FormRegisterPartnerSkeleton />
      </ModalDefault>
    );
  }

  return (
    <ModalDefault
      modalName={REGISTER_PARTNER_MODAL_NAME}
      title={partnerId ? "Editar cadastro" : "Novo cadastro"}
    >
      <FormDefault
        form={form}
        onSubmit={(e) => {
          e.preventDefault();
          registerPartnerAction.mutate({
            ...form.getValues(),
            id: partnerId,
            contacts: contacts.map((contact) => contact.raw()),
          });
        }}
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
        <AccordionBase title="Contatos" id="contacts">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex w-full items-end justify-between gap-4"
            >
              <div className="flex flex-col w-full gap-2">
                <Label>Nome</Label>
                <Input
                  className="w-full"
                  value={contact.name}
                  onChange={(e) => {
                    contact.name = e.target.value;
                    setContacts(
                      contacts.map((c) => (c.id === contact.id ? contact : c))
                    );
                  }}
                />
              </div>
              <div className="flex flex-col w-full max-w-[240px] gap-2">
                <Label>Telefone/Celular</Label>
                <InputPhone
                  value={contact.phone.value}
                  onChange={(phone) => {
                    contact.phone = Phone.create(phone);
                    setContacts(
                      contacts.map((c) => (c.id === contact.id ? contact : c))
                    );
                  }}
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="disabled:opacity-0"
                disabled={index === 0}
                onClick={() =>
                  setContacts(contacts.filter((c) => c.id !== contact.id))
                }
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="icon"
            type="button"
            className="w-full border-dashed font-light text-muted-foreground bg-transparent"
            onClick={() => setContacts([...contacts, Contact.create("", "")])}
          >
            <PlusIcon className="w-4 h-4" />
            Adicionar contato
          </Button>
        </AccordionBase>
        <FormFooter
          isLoading={registerPartnerAction.isPending}
          onCancel={() => {
            closeModal(REGISTER_PARTNER_MODAL_NAME);
          }}
        />
      </FormDefault>
    </ModalDefault>
  );
}
