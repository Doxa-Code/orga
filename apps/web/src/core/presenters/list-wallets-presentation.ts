import type { ListWalletsOutputDTO } from "../application/usecases/list-wallets";
import { Transaction } from "../domain/entities/transaction";

export class ListWalletsPresentation {
  static create(wallets: InputDTO[]): ListWalletsPresentationOutputDTO[] {
    return wallets.map((wallet) => ({
      id: wallet.id,
      flag: wallet?.bank?.thumbnail,
      surname: wallet.name,
      bankName: wallet?.bank?.name,
      type: wallet.type,
      balance: wallet.balance,
    }));
  }

  static likeOption(wallets: InputDTO[]): ListWalletLikeOptionOutputDTO[] {
    return wallets.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      bank: wallet.bank,
      type: wallet.type,
      agency: wallet.agency,
      number: wallet.number,
    }));
  }
}

type InputDTO = ListWalletsOutputDTO;
export type TransactionsHistoryOutpuDTO = {
  amount: number;
  date: Date;
  description: string;
  type: Transaction.Type;
};

export type ListWalletLikeOptionOutputDTO = {
  id: string;
  name: string;
  bank: { thumbnail: string; code: string; name: string };
  type: string;
  agency: string;
  number: string;
};

export type ListWalletsPresentationOutputDTO = {
  id: string;
  flag: string;
  surname: string;
  bankName: string;
  type: string;
  balance: number;
};
