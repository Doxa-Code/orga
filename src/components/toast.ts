import { toast } from "sonner";

export class Toast {
  static error(message: string, description?: string) {
    toast.error(message, {
      description: description,
      classNames: {
        toast: "!border-l-rose-500 !border-l-4 !rounded",
        description: "!text-muted-foreground !font-light",
        title: "!text-rose-500",
        icon: "!hidden",
      },
      position: "top-right",
    });
  }
  static success(message: string, description?: string) {
    toast.success(message, {
      description: description,
      classNames: {
        toast: "!border-l-teal-500 !border-l-4 !bg-teal-50 !rounded",
        description: "!text-muted-foreground !font-light",
        title: "!text-teal-500",
        icon: "!hidden",
      },
      position: "top-right",
    });
  }
}
