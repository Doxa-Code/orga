"use server";
import { securityProcedure } from "@/app/actions/security-procedure";
import { Bucket } from "@/core/domain/entities/bucket";
import {
  deleteBucketInputSchema,
  deleteProposalInputSchema,
  listBucketsOutputSchema,
  listProposalsOutputSchema,
  upsertBucketInputSchema,
  upsertProposalInputSchema,
} from "./schemas";
import { prisma } from "@/lib/prisma";

export const deleteProposal = securityProcedure
  .input(deleteProposalInputSchema)
  .handler(async ({ ctx: { workspace }, input }) => {
    await prisma.proposal.delete({
      where: {
        id: input.id,
        workspaceId: workspace.id,
      },
      include: {
        tags: true,
        followUps: true,
      },
    });
  });

export const upsertProposals = securityProcedure
  .input(upsertProposalInputSchema)
  .handler(async ({ ctx: { workspace }, input }) => {
    await Promise.all(
      input.map(async (proposal) => {
        const exists = await prisma.proposal.findUnique({
          where: {
            id: proposal.id,
          },
        });

        if (!exists) {
          const response = await prisma.proposal.findFirst({
            where: {
              workspaceId: workspace.id,
            },
            orderBy: {
              position: "desc",
            },
          });

          const lastPosition = response?.position ?? 0;
          await prisma.proposal.create({
            data: {
              amount: proposal.amount,
              closedAt: proposal.closedAt,
              createdAt: proposal.createdAt,
              description: proposal.description,
              partnerId: proposal.partner.id,
              owner: proposal.owner,
              position: lastPosition + 1,
              stage: proposal.stage,
              source: proposal.source,
              segment: proposal.segment,
              title: proposal.title,
              workspaceId: workspace.id,
              tags: {
                create: proposal.tags.map((tag) => ({
                  color: tag.color,
                  value: tag.value,
                })),
              },
              followUps: {
                create: proposal.followUps.map((followUp) => ({
                  content: followUp.content,
                  createdAt: followUp.createdAt,
                  createdBy: followUp.createdBy,
                  type: followUp.type,
                })),
              },
              id: proposal.id,
              updatedAt: proposal.updatedAt,
            },
          });
          return;
        }

        await prisma.$transaction([
          prisma.tag.deleteMany({
            where: {
              proposals: {
                some: {
                  id: proposal.id,
                },
              },
            },
          }),
          prisma.followUp.deleteMany({
            where: {
              proposalId: proposal.id,
            },
          }),
          prisma.proposal.update({
            where: { id: proposal.id },
            data: {
              amount: proposal.amount,
              closedAt: proposal.closedAt,
              createdAt: proposal.createdAt,
              description: proposal.description,
              partnerId: proposal.partner.id,
              owner: proposal.owner,
              position: proposal.position,
              stage: proposal.stage,
              source: proposal.source,
              segment: proposal.segment,
              title: proposal.title,
              updatedAt: proposal.updatedAt,
              tags: {
                create: proposal.tags.map((tag) => ({
                  color: tag.color,
                  value: tag.value,
                })),
              },
              followUps: {
                create: proposal.followUps.map((followUp) => ({
                  content: followUp.content,
                  createdAt: followUp.createdAt,
                  createdBy: followUp.createdBy,
                  type: followUp.type,
                })),
              },
              id: proposal.id,
              workspaceId: workspace.id,
            },
          }),
        ]);
      })
    );
  });

export const deleteBucket = securityProcedure
  .input(deleteBucketInputSchema)
  .handler(async ({ input }) => {
    const { id } = input;
    await prisma.bucket.delete({ where: { id } });
  });

export const upsertBucket = securityProcedure
  .input(upsertBucketInputSchema)
  .handler(async ({ ctx: { workspace }, input }) => {
    await Promise.all(
      input.map(async (bucket) => {
        const { id, position, name, color } = bucket;
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
      })
    );
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
            contacts: true,
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
