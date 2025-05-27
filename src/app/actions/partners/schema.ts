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

export const retrievePartnerByTaxIdInputSchema = z.object({
  taxId: z.string(),
});

export const retrievePartnerByTaxIdOutputSchema = z
  .object({
    name: z.string(),
    type: z.enum(["COMPANY", "INDIVIDUAL"]),
    address: z.object({
      city: z.string(),
      country: z.string(),
      neighborhood: z.string(),
      note: z.string(),
      number: z.string(),
      state: z.string(),
      street: z.string(),
      zipCode: z.string(),
    }),
    email: z.string(),
    phone: z.string(),
    taxId: z.string(),
  })
  .nullish();

export const listPartnersOptionOutputSchema = z.array(
  z.object({
    partnerId: z.string(),
    name: z.string(),
  }),
);

export const listPartnersLikeOptionInputSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
});
