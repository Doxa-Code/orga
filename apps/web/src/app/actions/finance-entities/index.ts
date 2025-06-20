"use server";

import { FinanceFactory } from "@/core/infra/factories/finance-factory";
import { securityProcedure } from "../security-procedure";
import {
  listBankOutputSchema,
  listFinanceEntitiesOutputSchema,
} from "./schema";
import { BankFactory } from "@/core/infra/factories/bank-factory";

export const listFinanceEntities = securityProcedure
  .output(listFinanceEntitiesOutputSchema)
  .handler(async ({ ctx: { user } }) => {
    const listEntities = FinanceFactory.listEntities();

    const result = await listEntities.execute(user.id);

    return {
      categories: result.categories.map((category) => ({
        name: category.name,
        sequence: category.sequence,
        type: category.type,
      })),
      costCenters: result.costCenters.map((costCenter) => ({
        code: costCenter.code,
        id: costCenter.id,
        name: costCenter.name,
        workspaceId: costCenter.workspaceId,
      })),
    };
  });

export const listBank = securityProcedure
  .output(listBankOutputSchema)
  .handler(async () => {
    const listBank = BankFactory.list();
    const banks = await listBank.execute();
    return banks;
  });
