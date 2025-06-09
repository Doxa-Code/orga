"use server";
import { securityProcedure } from "@/app/actions/security-procedure";
import { Bucket } from "@/core/domain/entities/bucket";
import { PrismaClient } from "@/generated/prisma";
import {
  deleteBucketInputSchema,
  listBucketsOutputSchema,
  listProposalsOutputSchema,
  upsertBucketInputSchema,
} from "./schemas";

const prisma = new PrismaClient();

export const deleteBucket = securityProcedure
  .input(deleteBucketInputSchema)
  .handler(async ({ input }) => {
    const { id } = input;
    await prisma.bucket.delete({ where: { id } });
  });

export const upsertBucket = securityProcedure
  .input(upsertBucketInputSchema)
  .handler(async ({ ctx: { workspace }, input }) => {
    const { id, position, name, color } = input;

    await prisma.bucket.upsert({
      where: { id },
      create: {
        name,
        color,
        workspaceId: workspace.id,
        position,
      },
      update: {
        name,
        color,
        position,
      },
    });
  });

export const createBucketDefault = securityProcedure
  .output(listBucketsOutputSchema)
  .handler(async ({ ctx: { workspace } }) => {
    const initialBuckets: Bucket[] = [
      Bucket.create("Novos Leads", "#D3D3D3", 1000),
      Bucket.create("Qualificados", "#3B82F6", 2000),
      Bucket.create("Proposta Enviada", "#8B5CF6", 3000),
      Bucket.create("Negociação", "#10B981", 4000),
      Bucket.create("Fechado", "#EF4444", 5000),
    ];

    await prisma.bucket.createMany({
      data: initialBuckets.map((bucket) => ({
        name: bucket.name,
        color: bucket.color,
        workspaceId: workspace.id,
        position: bucket.position,
        id: bucket.id,
      })),
    });

    return initialBuckets.map((bucket) => ({
      color: bucket.color,
      id: bucket.id,
      name: bucket.name,
      position: bucket.position,
    }));
  });

export const listBuckets = securityProcedure
  .output(listBucketsOutputSchema)
  .handler(async ({ ctx: { workspace } }) => {
    const response = await prisma.bucket.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    return response.map((bucket) => ({
      color: bucket.color,
      id: bucket.id,
      name: bucket.name,
      position: bucket.position,
    }));
  });

export const listProposals = securityProcedure
  .output(listProposalsOutputSchema)
  .handler(async ({ ctx: { workspace } }) => {
    const response = await prisma.proposal.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        partner: {
          include: {
            address: true,
          },
        },
        tags: true,
        followUps: true,
      },
    });

    return response.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      partner: proposal.partner,
      owner: proposal.owner,
      amount: proposal.amount,
      position: proposal.position,
      stage: proposal.stage,
      source: proposal.source,
      segment: proposal.segment,
      tags: proposal.tags,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      closedAt: proposal.closedAt,
      workspaceId: proposal.workspaceId,
      followUps: proposal.followUps,
    }));
  });
