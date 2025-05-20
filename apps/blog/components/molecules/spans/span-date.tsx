import { format } from "date-fns";
import { pt } from "date-fns/locale/pt";

export const SpanDate: React.FC<{ date?: Date }> = ({ date }) => {
  return (
    <div className="mt-5 flex items-center gap-5 text-base-content/60 ">
      <p className="text-base">
        {format(date || new Date(), "dd MMMM yyyy", { locale: pt })}
      </p>
    </div>
  );
};
