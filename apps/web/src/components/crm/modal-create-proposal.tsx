import { useServerActionMutation } from "@/app/actions/query-key-factory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import { Partner } from "@/core/domain/entities/partner";
import { Proposal } from "@/core/domain/entities/proposal";
import { Address } from "@/core/domain/valueobjects/address";
import { Email } from "@/core/domain/valueobjects/email";
import { Phone } from "@/core/domain/valueobjects/phone";
import { TaxId } from "@/core/domain/valueobjects/taxid";
import { useModais } from "@/hooks/use-modais";
import type React from "react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { InputMoney } from "../inputs/common/input-money";
import { Select } from "../selects/common/select";
import { Textarea } from "../ui/textarea";
import { listPartnersOutputSchema } from "@/app/actions/partners/schemas";
import { searchPartners } from "@/app/actions/partners";
import { Contact } from "@/core/domain/entities/contact";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (proposal: Proposal) => void;
}

export const ModalCreateProposal: React.FC<Props> = (props) => {
  const [partners, setPartners] = useState<
    z.infer<typeof listPartnersOutputSchema>
  >([]);
  const { openModal } = useModais();
  const searchPartnerAction = useServerActionMutation(searchPartners, {
    onSuccess: (data) => {
      setPartners(data);
    },
  });
  const debounce = useDebouncedCallback(searchPartnerAction.mutate, 500);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const partner = partners.find(
      (partner) => partner.id === formData.get("partnerId")
    );

    if (!partner) {
      return;
    }

    const proposal = Proposal.create({
      amount: Number(
        formData
          .get("amount")
          ?.toString()
          .replace(/\./gim, "")
          .replace(",", ".")
      ),
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      stage: "Novos Leads",
      partner: Partner.instance({
        address: Address.create({
          street: partner.address.street ?? "",
          number: partner.address.number ?? "",
          neighborhood: partner.address.neighborhood ?? "",
          city: partner.address.city ?? "",
          state: partner.address.state ?? "",
          zipCode: partner.address.zipCode ?? "",
          country: partner.address.country ?? "",
          note: partner.address.note ?? "",
        }),
        email: Email.create(partner.email),
        name: partner.name,
        phone: Phone.create(partner.phone),
        type: partner.type,
        roles: partner.roles,
        id: partner.id,
        taxId: TaxId.create(partner.taxId),
        status: partner.status as Partner.Status,
        createdAt: partner.createdAt,
        workspaceId: partner.workspaceId,
        contacts: partner.contacts.map((c) =>
          Contact.instance({
            ...c,
            phone: Phone.create(c.phone ?? ""),
          })
        ),
      }),
    });
    props.onAdd(proposal);
    props.onClose();
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Proposta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select
              onSearch={(value) => {
                debounce({ search: value });
              }}
              options={partners}
              name="partnerId"
              value="id"
              label="name"
              isSearching={searchPartnerAction.isPending}
              onAdd={() => {
                openModal(REGISTER_PARTNER_MODAL_NAME);
              }}
            />
          </div>

          <div>
            <Label>Título da Proposta</Label>
            <Input name="title" />
          </div>

          <div>
            <Label>Descrição da Proposta</Label>
            <Textarea className="resize-none" name="description" />
          </div>

          <div>
            <Label>Valor do Negócio (R$)</Label>
            <InputMoney name="amount" classNameContainer="max-w-[217px]" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Adicionar Proposta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
