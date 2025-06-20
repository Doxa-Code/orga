import { CostCenter } from "@/core/domain/valueobjects/cost-center";
import { Payment } from "../../domain/entities/payment";
import type { Transaction } from "../../domain/entities/transaction";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { FieldInvalid } from "../../domain/errors/field-invalid";
import { AccountPlan } from "@/core/domain/entities/account-plan";
import { Wallet } from "@/core/domain/entities/wallet";

interface TransactionRepository {
  retrieve(id: string): Promise<Transaction | null>;
  update(transaction: Transaction): Promise<void>;
}

interface CostCenterRepository {
  retrieve(id: string): Promise<CostCenter | null>;
}

interface AccountPlanRepository {
  retrieveBySequence(sequence: number): Promise<AccountPlan | null>;
}

interface RegisterTransactionOnWalletService {
  register(transaction: Transaction): Promise<void>;
  unregister(transaction: Transaction): Promise<void>;
}

interface WalletRepository {
  retrieve(id: string): Promise<Wallet | null>;
}

export class EditTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly costCenterRepository: CostCenterRepository,
    private readonly accountPlanRepository: AccountPlanRepository,
    private readonly registerTransactionOnWalletService: RegisterTransactionOnWalletService,
    private readonly walletRepository: WalletRepository
  ) {}

  async execute(input: InputDTO) {
    const transaction = await this.transactionRepository.retrieve(
      input.transactionId
    );

    if (!transaction) {
      throw new EntityNotFound("transaction");
    }

    if (input.costCenterId) {
      const costCenter = await this.costCenterRepository.retrieve(
        input.costCenterId
      );

      if (!costCenter) {
        throw new EntityNotFound("cost center");
      }

      transaction.selectCostCenter(costCenter.id, costCenter.name);
    }

    if (input.categorySequence) {
      const sequence = Number(input.categorySequence.split(".")[0]);

      if (isNaN(sequence)) {
        throw new FieldInvalid("category");
      }

      const accountPlan =
        await this.accountPlanRepository.retrieveBySequence(sequence);

      if (!accountPlan) {
        throw new EntityNotFound("category");
      }

      const category = accountPlan.categories.find(
        (category) => category.sequence === input.categorySequence
      );

      if (!category) {
        throw new EntityNotFound("category");
      }

      transaction.selectCategory(category.sequence, category.name);
    }

    transaction.update(input);

    await this.registerTransactionOnWalletService.unregister(transaction);

    transaction.clearPayments();

    if (input.payments?.length! > 1) {
      await Promise.all(
        input.payments!.map(async (payment) => {
          const wallet = await this.walletRepository.retrieve(payment.walletId);

          transaction.addPayment(
            Payment.create({
              amount: payment.amount,
              dueDate: payment.dueDate || input.defaultInstallmentDueDate,
              percentage: payment.percentage,
              walletId: wallet
                ? payment.walletId
                : input.defaultInstallmentWalletId,
              description: payment.description,
              status: input.paided ? "PAID" : "NO_PAID",
              paymentMethod:
                payment.paymentMethod || input.defaultInstallmentPaymentMethod,
            })
          );
        })
      );
    } else {
      transaction.addPayment(
        Payment.create({
          amount: transaction.amount,
          dueDate: new Date(input.defaultInstallmentDueDate),
          percentage: 100,
          walletId: input.defaultInstallmentWalletId,
          description: `${transaction.description} 1/1`,
          status: input.paided ? "PAID" : "NO_PAID",
          paymentMethod: input.defaultInstallmentPaymentMethod,
        })
      );
    }

    await this.registerTransactionOnWalletService.register(transaction);

    await this.transactionRepository.update(transaction);

    return transaction;
  }
}

export type InputDTO = {
  transactionId: string;
  paided?: boolean;
  dueDate?: Date;
  description?: string;
  amount?: number;
  costCenterId?: string;
  categorySequence?: string;
  installmentCount?: number;
  installmentInterval?: number;
  defaultInstallmentDueDate: Date;
  defaultInstallmentPaymentMethod?: Payment.Method;
  defaultInstallmentWalletId: string;
  userId: string;
  partnerId?: string | null;
  note?: string;
  payments?: {
    dueDate: Date;
    amount: number;
    percentage: number;
    paymentMethod: Payment.Method;
    walletId: string;
    description: string;
  }[];
};
