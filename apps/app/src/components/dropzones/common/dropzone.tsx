"use client";

import { Paragraph } from "@/components/common/typograph";
import { useDropzone } from "react-dropzone";

type Props = {
  onDrop(file?: File): void;
  accept?: Record<string, string[]>;
  "data-hidden"?: boolean;
  placeholder: string;
};

export const Dropzone: React.FC<Props> = (props) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles) {
      props.onDrop?.(acceptedFiles[0]);
    },
    accept: props.accept,
    maxFiles: 1,
  });

  return (
    <div
      data-hidden={props["data-hidden"]}
      {...getRootProps()}
      className="w-full h-[150px] flex rounded border-gray-300 justify-center items-center border-dashed border cursor-pointer"
    >
      <input {...getInputProps()} />
      <Paragraph className="text-gray-400 text-sm">
        {props.placeholder}
      </Paragraph>
    </div>
  );
};
