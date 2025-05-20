import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface DropZoneImageProps {
  onSelectedFiles(files: (File & { preview: string })[]): void;
}

export const useDropFiles = (props: DropZoneImageProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length <= 0) {
        toast.error("Por favor selecione um unico arquivo", {
          style: { color: "red" },
          position: "top-center",
        });
        return;
      }
      props.onSelectedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  return {
    rootProps: getRootProps(),
    inputProps: getInputProps(),
  };
};
