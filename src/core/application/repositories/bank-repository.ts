import { prisma } from "@/lib/prisma";
import type { Bank } from "../../domain/entities/bank";

interface BankRepository {
  create(bank: Bank): Promise<void>;
  list(): Promise<Bank[]>;
  retrieveByCode(code: string): Promise<Bank | null>;
  delete(code: string): Promise<void>;
}

export class BankRepositoryDatabase implements BankRepository {
  private readonly databaseConnection = prisma.bank;

  async delete(code: string): Promise<void> {
    await this.databaseConnection.delete({ where: { code } });
  }

  async retrieveByCode(code: string): Promise<Bank | null> {
    const result = await this.databaseConnection.findUnique({
      where: { code },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async create(bank: Bank): Promise<void> {
    await this.databaseConnection.create({
      data: bank,
    });
  }

  async list(): Promise<Bank[]> {
    const response = await this.databaseConnection.findMany();
    return response;
  }
}
