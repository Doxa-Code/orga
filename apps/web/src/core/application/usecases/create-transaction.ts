import { Workspace } from "@/core/domain/entities/workspace";
import { Payment } from "../../domain/entities/payment";
import { Transaction } from "../../domain/entities/transaction";
import { EntityNotFound } from "../../domain/errors/entity-not-found";
import { FieldInvalid } from "../../domain/errors/field-invalid";
import { AccountPlan } from "@/core/domain/entities/account-plan";
import { CostCenter } from "@/core/domain/valueobjects/cost-center";

interface WorkspaceRepository {
  retrieve(id: string): Promise<Workspace | null>;
}

interface AccountPlanRepository {
  retrieveBySequence(sequence: number): Promise<AccountPlan | null>;
}

interface CostCenterRepository {
  retrieve(id: string): Promise<CostCenter | null>;
}

interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

interface RegisterTransactionOnWalletService {
  register(transaction: Transaction): Promise<void>;
}

export class CreateTransaction {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly accountPlanRepository: AccountPlanRepository,
    private readonly costCenterRepository: CostCenterRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly verifyPermission: VerifyPermissionService,
    private readonly registerTransactionOnWalletService: RegisterTransactionOnWalletService
  ) {}

  async execute(input: CreateTransactionInputDTO) {
    const transaction = Transaction.create({
      amount: input.amount,
      description: input.description,
      type: input.type as Transaction.Type,
      workspaceId: input.workspaceId,
      dueDate: input.dueDate,
      partnerId: input.partnerId,
      note: input.note,
    });

    const workspace = await this.workspaceRepository.retrieve(
      input.workspaceId
    );

    if (!workspace) {
      throw new EntityNotFound("workspace");
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

      const category = accountPlan.categories?.find(
        (category) => category.sequence === input.categorySequence
      );

      if (!category) {
        throw new EntityNotFound("category");
      }

      transaction.selectCategory(category.sequence, category.name);
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

    await this.verifyPermission.execute(input.userId, input.workspaceId);

    if (input.payments?.length! > 0) {
      await Promise.all(
        input.payments!.map(async (payment) => {
          transaction.addPayment(
            Payment.create({
              amount: payment.amount,
              dueDate: payment.dueDate || input.defaultInstallmentDueDate,
              percentage: payment.percentage,
              walletId: payment.walletId || input.defaultInstallmentWalletId,
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

    await this.transactionRepository.save(transaction);

    return transaction;
  }
}

export interface CreateTransactionInputDTO {
  paided?: boolean;
  type: string;
  dueDate: Date;
  description: string;
  amount: number;
  costCenterId?: string;
  categorySequence: string;
  defaultInstallmentDueDate: Date;
  defaultInstallmentPaymentMethod?: Payment.Method;
  defaultInstallmentWalletId: string;
  userId: string;
  workspaceId: string;
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
}
