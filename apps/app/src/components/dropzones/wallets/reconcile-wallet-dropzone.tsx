"use client";

import { getPayload } from "@/app/actions/auth";
import { Paragraph } from "@/components/common/typograph";
import { type LoadOFXOutputDTO, useTransaction } from "@/hooks/use-transaction";
import { LoadingFilesAnimation } from "@orga/ui/lotties";
import { Progress } from "@orgaogress";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { useServerAction } from "zsa-react";
import { Dropzone } from "../common/dropzone";

type Props = {
  hidden?: boolean;
  walletId: string;
};

type Process = {
  processed: number;
  total: number;
  percentage: number;
};

type WorkerPayload =
  | {
      event: "update";
      data: Process;
    }
  | {
      event: "finished";
      data: LoadOFXOutputDTO[];
    };

export const ReconcileWalletDropzone: React.FC<Props> = (props) => {
  const workerRef = useRef<Worker>();
  const getPayloadAction = useServerAction(getPayload);
  const { set } = useTransaction();
  const [process, setProcess] = useState<Process | null>(null);

  useEffect(() => {
    workerRef.current = new Worker("/workers/load-ofx-worker.js", {
      type: "module",
    });

    workerRef.current.onmessage = async ({ data }: { data: WorkerPayload }) => {
      if (data.event === "update") {
        setProcess(data.data);
        return;
      }
      set({
        transactionsToReconcile: [],
      });
      set({ transactionsToReconcile: data.data });
      setProcess(null);
    };
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  if (process) {
    return (
      <section className="flex py-28 flex-col justify-center items-center gap-4">
        <div className="w-96 flex group-data-[loading=false]:hidden overflow-hidden">
          <Lottie
            options={{
              animationData: LoadingFilesAnimation,
              loop: true,
              autoplay: true,
            }}
            style={{
              padding: 0,
            }}
            width={500}
          />
        </div>
        <Progress value={process.percentage} className="max-w-[300px]" />

        <Paragraph className="font-light animate-pulse text-gray-400">
          Carregando ofx ({process.processed}/{process.total})
        </Paragraph>
      </section>
    );
  }

  return (
    <Dropzone
      data-hidden={props.hidden}
      onDrop={async (file) => {
        if (!file) {
          return;
        }
        const [payload] = await getPayloadAction.execute();
        workerRef.current?.postMessage({ file, token: payload?.token });
      }}
      accept={{
        "application/offix": [".ofx"],
      }}
      placeholder="Arraste o arquivo .ofx até aqui para começar"
    />
  );
};
