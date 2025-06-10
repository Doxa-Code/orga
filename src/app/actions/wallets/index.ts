"use server";

import { unstable_cache } from "next/cache";
import { securityProcedure } from "../security-procedure";
import {
  deleteWalletInputSchema,
  listWalletsLikeOptionOutputSchema,
  listWalletsOutputSchema,
  registerWalletInputSchema,
  retrieveWalletInputSchema,
  retrieveWalletOutputSchema,
  retrieveWalletTransactionsHistoryInputSchema,
  retrieveWalletTransactionsHistoryOutputSchema,
} from "./schema";
import { WalletFactory } from "@/core/infra/factories/wallet-factory";
import { ListWalletsPresentation } from "@/core/presenters/list-wallets-presentation";

export const listWalletsLikeOption = securityProcedure
  .output(listWalletsLikeOptionOutputSchema)
  .handler(async ({ ctx: { user } }) => {
    return unstable_cache(
      async () => {
        const listWallets = WalletFactory.list();

        const wallets = await listWallets.execute(user.id);

        return ListWalletsPresentation.likeOption(wallets);
      },
      [],
      {
        revalidate: 180,
        tags: [`list_wallet_like_option_${user.id}`],
      }
    )();
  });

export const registerWallet = securityProcedure
  .input(registerWalletInputSchema)
  .handler(async ({ input, ctx: { user, workspace } }) => {
    const createWallet = WalletFactory.create();
    const editWallet = WalletFactory.edit();
    if (input.walletId) {
      return await editWallet.execute({
        userId: user.id,
        walletId: input.walletId,
        agency: input.agency,
        bankCode: input.bankCode,
        name: input.name,
        number: input.number,
        type: input.type,
      });
    }
    await createWallet.execute({
      balance: input.balance,
      bankCode: input.bankCode,
      name: input.name,
      type: input.type,
      userId: user.id,
      workspaceId: workspace.id,
      agency: input.agency,
      number: input.number,
    });
  });

export const listWallets = securityProcedure
  .output(listWalletsOutputSchema)
  .handler(async ({ ctx: { user } }) => {
    const listWallets = WalletFactory.list();

    const wallets = await listWallets.execute(user.id);

    return ListWalletsPresentation.create(wallets);
  });

export const retrieveWallet = securityProcedure
  .input(retrieveWalletInputSchema)
  .output(retrieveWalletOutputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const retrieveWallet = WalletFactory.retrieve();

    const result = await retrieveWallet.execute(input.walletId, user.id);

    return result;
  });

export const retrieveWalletTransactionsHistory = securityProcedure
  .input(retrieveWalletTransactionsHistoryInputSchema)
  .output(retrieveWalletTransactionsHistoryOutputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const retrieveWalletTransactionsHistory =
      WalletFactory.retrieveTransactionHistory();

    const result = await retrieveWalletTransactionsHistory.execute({
      from: input.from,
      to: input.to,
      userId: user.id,
      walletId: input.walletId,
    });

    return result;
  });

export const deleteWallet = securityProcedure
  .input(deleteWalletInputSchema)
  .handler(async ({ input, ctx: { user } }) => {
    const deleteWallet = WalletFactory.delete();

    await deleteWallet.execute({
      userId: user.id,
      walletId: input.walletId,
    });
  });
