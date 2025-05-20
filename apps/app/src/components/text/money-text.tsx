import type React from "react";
import { Paragraph } from "../common/typograph";

type Props = {
  amount: number;
};

export const MoneyText: React.FC<Props> = ({ amount = 0 }) => (
  <div className="flex gap-2 items-end">
    <Paragraph
      data-positive={amount > 0}
      data-negative={amount < 0}
      className="font-medium text-slate-500"
    >
      R$
    </Paragraph>
    <Paragraph
      data-positive={amount > 0}
      data-negative={amount < 0}
      className="font-semibold text-lg text-slate-500"
    >
      {amount
        .toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
        })
        .replace("R$", "")}
    </Paragraph>
  </div>
);
