import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareStrings = (left?: string | null, right?: string | null) =>
  String(left || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .includes(
      String(right || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    );

export const formatTaxId = (inputValue?: string, type?: string) => {
  if (!inputValue) {
    return "";
  }

  let value = inputValue;

  value = value.replace(/\D/g, "");

  if (type === "INDIVIDUAL") {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

  return value;
};

export const formatPhone = (inputValue?: string) => {
  if (!inputValue) {
    return "";
  }

  let value = inputValue;
  value = value.replace(/\D/g, "");

  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d)/, "$1 $2");
    value = value.replace(/^(\d{2})\s(\d{4})(\d)/, "$1 $2-$3");
    value = value.replace(/\-(\d{1,4})$/, "-$1");
  } else {
    value = value.replace(/^(\d{2})(\d)/, "$1 $2");
    value = value.replace(/^(\d{2})\s(\d{1})(\d)/, "$1 $2 $3");
    value = value.replace(/^(\d{2})\s(\d{1})\s(\d{4})(\d)/, "$1 $2 $3-$4");
    value = value.replace(/\-(\d{1,4})$/, "-$1");
  }

  return value;
};
