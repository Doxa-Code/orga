import { cn } from "@orga/utils";
import type { ReactNode } from "react";

interface MainPageProps {
  children: ReactNode;
  className?: string;
}

export function MainPage(props: MainPageProps) {
  return (
    <main
      className={cn(
        "w-full px-6 flex-1 overflow-hidden flex max-h-screen space-y-4 flex-col max-w-[1544px] mx-auto",
        props.className,
      )}
    >
      {props.children}
    </main>
  );
}
