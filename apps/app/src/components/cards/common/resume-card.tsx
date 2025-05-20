import { Paragraph } from "@/components/common/typograph";
import { Card } from "@orga/ui/card";
import { Skeleton } from "@orgaeleton";

type Props = {
  title: string;
  value: number;
  type: "DEBIT" | "CREDIT" | "TOTAL";
  isSelected: boolean;
  onSelected(): void;
  isFetching?: boolean;
};

export function ResumeCard(props: Props) {
  return (
    <div className="group w-full">
      <Skeleton
        data-hidden={!props.isFetching}
        className="w-full h-[74px] rounded-none border-t bg-background border-gray-300 group-first:border-r group-last:border-l"
      />
      <Card
        data-hidden={props.isFetching}
        onClick={() => props.onSelected()}
        data-type={props.type}
        data-selected={props.isSelected}
        className="group flex w-full cursor-pointer select-none flex-col items-center justify-center border-t border-gray-300 py-3 group-first:border-r group-last:border-l data-[selected=true]:border-t-2 data-[selected=true]:data-[type=CREDIT]:border-t-green-600 data-[selected=true]:data-[type=DEBIT]:border-t-red-600 data-[selected=true]:data-[type=TOTAL]:border-t-sky-600"
      >
        <Paragraph className="text-sm">{props.title}</Paragraph>
        <Paragraph
          data-type={props.type}
          className="text-xl font-medium group-data-[type=CREDIT]:text-green-600 group-data-[type=DEBIT]:text-red-600 group-data-[type=TOTAL]:text-sky-600"
        >
          {props.value
            ?.toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            })
            .replace("R$", "")}
        </Paragraph>
      </Card>
    </div>
  );
}
