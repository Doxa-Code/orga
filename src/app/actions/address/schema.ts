import { z } from "zod";

export const listStateAddressOutputSchema = z.array(
  z.object({ acronym: z.string(), name: z.string() })
);

export const listCitiesAddressInputSchema = z.object({
  acronym: z.string().optional(),
});

export const listCitiesAddressOutputSchema = z.array(
  z.object({ name: z.string() })
);

export const loadCEPInputSchema = z.object({
  zipCode: z.string(),
});

export const loadCEPOutputSchema = z
  .object({
    city: z.string().nullable(),
    country: z.string().nullable(),
    neighborhood: z.string().nullable(),
    state: z.string().nullable(),
    street: z.string().nullable(),
    zipCode: z.string().nullable(),
    number: z.string().nullable(),
    note: z.string().nullable(),
  })
  .nullish();
