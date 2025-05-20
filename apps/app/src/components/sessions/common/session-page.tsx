import type { ReactNode } from "react";

export const SessionPage: React.FC<{ children: ReactNode }> = (props) => {
  return (
    <section className="rounded shadow bg-white flex flex-col flex-1 overflow-hidden p-4">
      {props.children}
    </section>
  );
};
