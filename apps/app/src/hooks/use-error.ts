import { useEffect, useState } from "react";

let timer: NodeJS.Timeout;

export const useError = () => {
  const [error, onError] = useState<string | null>(null);
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => onError(null), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  return {
    error,
    onError,
  };
};
