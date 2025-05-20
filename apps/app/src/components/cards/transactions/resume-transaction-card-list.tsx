"use client";
import { useQueryStateTransactions } from "@/hooks/use-query-state-transactions";
import { ResumeCard } from "../common/resume-card";

type Props = {
  resume: { credit: number; debit: number; total: number };
};

export const ResumeTransactionCardList: React.FC<Props> = (props) => {
  const { setFilters, filterTypeTransaction } = useQueryStateTransactions();

  return (
    <section className="flex border-x">
      <ResumeCard
        isSelected={filterTypeTransaction === "CREDIT"}
        title="Receita (R$)"
        type="CREDIT"
        value={props.resume!.credit}
        onSelected={() => setFilters({ filterTypeTransaction: "CREDIT" })}
      />
      <ResumeCard
        isSelected={filterTypeTransaction === "DEBIT"}
        title="Despesa (R$)"
        type="DEBIT"
        value={props.resume!.debit}
        onSelected={() => setFilters({ filterTypeTransaction: "DEBIT" })}
      />
      <ResumeCard
        isSelected={filterTypeTransaction === "TOTAL"}
        title="Total do período (R$)"
        type="TOTAL"
        value={props.resume!.total}
        onSelected={() => setFilters({ filterTypeTransaction: "TOTAL" })}
      />
    </section>
  );
};
