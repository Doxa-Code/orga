import { z } from "zod";

export const registerPartnerFormSchema = z.object({
  id: z.string().nullish(),
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  roles: z.array(z.enum(["CUSTOMER", "SUPPLIER"])).min(1, {
    message: "Preecha pelo menos 1 tipo",
  }),
  name: z.string().min(2, { message: "Deve ter no mínimo 2 caracteres" }),
  taxId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  contacts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string().optional(),
    })
  ),
  address: z.object({
    street: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    number: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    neighborhood: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    city: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    state: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    zipCode: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    country: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
    note: z
      .string()
      .optional()
      .nullish()
      .transform((value) => value ?? ""),
  }),
});

export const retrievePartnerByTaxIdInputSchema = z.object({
  taxId: z.string(),
});

export const retrievePartnerInputSchema = z.object({
  id: z.string(),
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
  })
);

export const listPartnersLikeOptionInputSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
});

export const partnerSchema = z.object({
  id: z.string(),
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  roles: z.array(z.enum(["CUSTOMER", "SUPPLIER"])),
  name: z.string(),
  taxId: z.string(),
  email: z.string(),
  phone: z.string(),
  contacts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string().optional(),
    })
  ),
  address: z.object({
    street: z.string().nullish(),
    number: z.string().nullish(),
    neighborhood: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    zipCode: z.string().nullish(),
    country: z.string().nullish(),
    note: z.string().nullish(),
  }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  createdAt: z.date(),
  workspaceId: z.string(),
});

export const listPartnersOutputSchema = z.array(partnerSchema);

export const searchPartnersInputSchema = z.object({
  search: z.string(),
});
