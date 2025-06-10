import { Payment } from "@/core/domain/entities/payment";
import type { Transaction } from "../../domain/entities/transaction";

interface TransactionRepository {
  retrieve(id: string): Promise<Transaction | null>;
  update(transaction: Transaction): Promise<void>;
}

interface VerifyPermissionService {
  execute(userId: string, workspaceId: string): Promise<void>;
}

interface RegisterTransactionOnWalletService {
  register(transaction: Transaction): Promise<void>;
  reversalPayment(payment: Payment, type: Transaction.Type): Promise<void>;
}

export class MakePaymentOnTransaction {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly verifyPermissionService: VerifyPermissionService,
    private readonly registerTransactionOnWalletService: RegisterTransactionOnWalletService
  ) {}
  async execute(input: InputDTO) {
    const transaction = await this.transactionRepository.retrieve(
      input.transactionId
    );

    if (!transaction) {
      return;
    }

    await this.verifyPermissionService.execute(
      input.userId,
      transaction.workspaceId
    );

    const payment = transaction.getPayment(input.paymentId);

    if (!payment) {
      return;
    }

    await this.registerTransactionOnWalletService.reversalPayment(
      payment,
      transaction.type
    );

    payment.pay(input.amountPaided, input.paymentMethod, input.paymentDate);

    transaction.updatePayment(payment);

    await this.transactionRepository.update(transaction);

    await this.registerTransactionOnWalletService.register(transaction);
  }
}

type InputDTO = {
  transactionId: string;
  paymentId: string;
  paymentDate: Date;
  amountPaided: number;
  paymentMethod: Payment.Method;
  walletId: string;
  userId: string;
};
