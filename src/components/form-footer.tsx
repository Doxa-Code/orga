import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  onCancel?: () => void;
  disableConfirm?: boolean;
  textConfirm?: string;
  isLoading?: boolean;
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
          className="h-12 rounded border bg-gray-100 text-primary hover:text-primary/80"
          variant="ghost"
          type="button"
        >
          Cancelar
        </Button>
        <Button
          disabled={Boolean(props.disableConfirm) || props.isLoading}
          size="default"
          className="h-12 rounded bg-primary hover:bg-primary hover:bg-opacity-70 disabled:bg-slate-400 disabled:text-slate-900"
          type="submit"
        >
          {props.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Cadastrando...
            </>
          ) : (
            props.textConfirm || "Cadastrar"
          )}
        </Button>
      </div>
    </footer>
  );
};
