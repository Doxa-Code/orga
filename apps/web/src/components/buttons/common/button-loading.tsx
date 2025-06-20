"use client";

import { Paragraph } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingAnimation } from "@/lotties";
import Lottie from "react-lottie";

type Props = {
  isLoading: boolean;
  disabled?: boolean;
  onClick(): void;
  className?: string;
  text: string;
};

export const ButtonLoading: React.FC<Props> = (props) => {
  return (
    <Button
      data-loading={props.isLoading}
      disabled={props.isLoading || props.disabled}
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        "group h-10 min-w-24 rounded-l-none relative !border-l-0 hover:bg-background",
        props.className,
      )}
      onClick={props.onClick}
    >
      <Paragraph className="font-medium text-sky-800 group-data-[loading=true]:hidden">
        {props.text || "Buscar"}
      </Paragraph>
      <div className="w-9 flex group-data-[loading=false]:hidden overflow-hidden">
        <Lottie
          options={{
            animationData: LoadingAnimation,
            loop: true,
            autoplay: true,
          }}
          style={{
            padding: 0,
          }}
          width={500}
        />
      </div>
    </Button>
  );
};
