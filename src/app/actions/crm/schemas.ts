import { z } from "zod";
import { partnerSchema } from "../partners/schemas";

export const deleteBucketInputSchema = z.object({
  id: z.string(),
});

export const listBucketsOutputSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
    name: z.string(),
    color: z.string(),
  })
);

export const listProposalsOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    partner: partnerSchema,
    owner: z.string(),
    amount: z.number(),
    position: z.number(),
    stage: z.string(),
    source: z.enum(["referral", "organic", "ads", "outbound", "other"]),
    segment: z.string(),
    tags: z.array(
      z.object({
        value: z.string(),
        color: z.string(),
      })
    ),
    createdAt: z.date(),
    updatedAt: z.date(),
    closedAt: z.date().nullable(),
    workspaceId: z.string(),
    followUps: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        createdAt: z.date(),
        createdBy: z.string(),
        type: z.enum(["call", "email", "meeting", "message", "other"]),
      })
    ),
  })
);

export const upsertBucketInputSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
    name: z.string(),
    color: z.string(),
  })
);

export const upsertProposalInputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    partner: partnerSchema,
    owner: z.string(),
    amount: z.number(),
    position: z.number(),
    stage: z.string(),
    source: z.enum(["referral", "organic", "ads", "outbound", "other"]),
    segment: z.string(),
    tags: z.array(
      z.object({
        value: z.string(),
        color: z.string(),
      })
    ),
    createdAt: z.date(),
    updatedAt: z.date(),
    closedAt: z.date().nullable(),
    workspaceId: z.string(),
    followUps: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        createdAt: z.date(),
        createdBy: z.string(),
        type: z.enum(["call", "email", "meeting", "message", "other"]),
      })
    ),
  })
);

export const deleteProposalInputSchema = z.object({
  id: z.string(),
});
