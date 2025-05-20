import { type Ref, useImperativeHandle } from "react";

export type FormHandlesRef = {
  progressStatus: boolean;
};

type Props = {
  ref: Ref<FormHandlesRef>;
  progressStatus: boolean;
};

export const useFormHandlesRef = (props: Props) => {
  return useImperativeHandle(
    props.ref,
    () => ({
      progressStatus: props.progressStatus,
    }),
    [props.progressStatus],
  );
};
