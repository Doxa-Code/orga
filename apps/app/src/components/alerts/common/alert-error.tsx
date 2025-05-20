import { Alert, AlertDescription, AlertTitle } from "@orga/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface AlertErrorProps {
  title?: string;
  message?: string | null;
}

export function AlertError(props: AlertErrorProps) {
  if (!props.message) {
    return <></>;
  }
  return (
    <Alert className="rounded border-l-4 border-red-500 bg-transparent font-extralight">
      <ExclamationTriangleIcon className="h-4 w-4 stroke-red-500" />
      <AlertTitle className="text-red-600">
        {props.title || "Algo está errado!"}
      </AlertTitle>
      <AlertDescription>
        {props.message || "Espere um pouco e tente novamente!"}
      </AlertDescription>
    </Alert>
  );
}
