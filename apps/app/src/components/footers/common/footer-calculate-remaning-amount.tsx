import { Heading, Paragraph } from "@/components/common/typograph";

type Props = {
  amount?: number;
  amountPaided?: number;
};

export const FooterCalculateRemaningAmount: React.FC<Props> = (props) => {
  const calculateRemaningAmount = () => {
    const remaningAmount = props.amount! - props.amountPaided!;
    if (
      isNaN(remaningAmount) ||
      !isFinite(remaningAmount) ||
      remaningAmount < 0
    ) {
      return 0;
    }
    return remaningAmount;
  };

  return (
    <div className="w-full flex flex-col justify-center items-end">
      <Paragraph>Total em aberto</Paragraph>
      <Heading level={1}>
        {calculateRemaningAmount().toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
        })}
      </Heading>
    </div>
  );
};
