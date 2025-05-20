import { Paragraph } from "@/components/common/typograph";
import { ModalConfirm } from "@/components/modais/common/modal-confirm";
import { cn } from "@orga";
import { Button } from "@orga/ui/button";

type Props = {
  hidden: boolean;
  selectedsCount?: number;
  buttons: Array<{
    action(): void;
    withConfirmation?: boolean;
    className?: string;
    text: string;
    disabled?: boolean;
  }>;
};
export const ActionsTable: React.FC<Props> = (props) => {
  return (
    <section
      data-hidden={props.hidden}
      className="group flex z-50 items-center gap-4 overflow-hidden border !bg-background px-6 duration-200 data-[hidden=false]:h-14 data-[hidden=true]:!h-0 data-[hidden=true]:border-none"
    >
      <Paragraph
        data-hidden={!props.selectedsCount}
        className="text-sm group-data-[hidden=true]:opacity-0"
      >
        {props.selectedsCount} itens selecionados
      </Paragraph>
      {props.buttons.map((button) => {
        if (button.withConfirmation) {
          return (
            <ModalConfirm key={button.text} onContinue={button.action}>
              <Button
                disabled={button.disabled}
                size="sm"
                variant="outline"
                className={cn(
                  "bg-transparent hover:opacity-60 group-data-[hidden=true]:opacity-0",
                  button.className,
                )}
              >
                {button.text}
              </Button>
            </ModalConfirm>
          );
        }
        return (
          <Button
            key={button.text}
            disabled={button.disabled}
            size="sm"
            variant="outline"
            className={cn(
              "bg-transparent hover:opacity-60 group-data-[hidden=true]:opacity-0",
              button.className,
            )}
            onClick={button.action}
          >
            {button.text}
          </Button>
        );
      })}
    </section>
  );
};
