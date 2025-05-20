import { Button } from "@orga/ui/button";

type Props = {
  onCancel?: () => void;
  onConfirm?: () => void;
  disableConfirm?: boolean;
  textConfirm?: string;
};

export const FormFooter: React.FC<Props> = (props) => {
  return (
    <footer className="w-full items-center absolute flex left-0 bottom-0 justify-center border-t bg-white py-6">
      <div className="container flex w-full items-center justify-between">
        <Button
          onClick={() => {
            props?.onCancel?.();
          }}
          size="default"
          className="h-12 rounded border bg-gray-100 text-sky-500 hover:text-sky-300"
          variant="ghost"
          type="button"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => props.onConfirm?.()}
          disabled={Boolean(props.disableConfirm)}
          size="default"
          className="h-12 rounded bg-sky-500 hover:bg-sky-400 hover:bg-opacity-70 disabled:bg-slate-400 disabled:text-slate-900"
          type="submit"
        >
          {props.textConfirm || "Cadastrar"}
        </Button>
      </div>
    </footer>
  );
};
