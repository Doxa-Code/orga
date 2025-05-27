import type { TableHandles } from "@/components/tables/common/table";
import { useEffect, useRef } from "react";

type Props = {
  rowsSelected: any[];
};

export const useTableRefToManagerSelection = (props: Props) => {
  const ref = useRef<TableHandles>(null);
  useEffect(() => {
    if (props.rowsSelected?.length <= 0) {
      ref.current?.clearSelection();
    }
  }, [props.rowsSelected]);

  return ref;
};
