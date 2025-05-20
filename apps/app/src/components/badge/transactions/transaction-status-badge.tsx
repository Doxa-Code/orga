import * as Icons from "@/components/common/icons";
import type {
  TransactionStatus,
  TransactionType,
} from "@orga/core/domain";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@orgaoltip";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  type: TransactionType;
}

export function TransactionStatusBadge(props: TransactionStatusBadgeProps) {
  if (props.status === "no paid") {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Icons.ThumbsDown className="size-6 text-slate-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{props.type === "CREDIT" ? "Não recebido" : "Não pago"}</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (props.status === "paid") {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Icons.ThumbsUp className="size-6 text-emerald-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{props.type === "CREDIT" ? "Recebido" : "Pago"}</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (props.status === "overdue") {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Icons.Danger className="size-6 text-red-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Vencido</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <Icons.Alert className="size-6 text-yellow-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Vence hoje</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
