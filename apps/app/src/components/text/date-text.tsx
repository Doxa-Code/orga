import { format } from "date-fns";
import { pt } from "date-fns/locale/pt";
import type React from "react";
import { Paragraph } from "../common/typograph";

type Props = {
  date?: Date;
};

export const DateText: React.FC<Props> = ({ date }) => (
  <div className="flex gap-2 text-xs">
    <Paragraph className="font-medium text-slate-600">
      {date && format(date, "dd/MM/yyyy")}
    </Paragraph>
    <Paragraph className="text-slate-600">
      {date && format(date, "EEEE", { locale: pt })}
    </Paragraph>
  </div>
);
