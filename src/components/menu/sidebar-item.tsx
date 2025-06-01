import { Paragraph } from "@/components/common/typograph";
import * as AllIcons from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Module } from "./module";

export const SidebarItem = ({ module }: { module: Module }) => {
  const Icon = (AllIcons as any)[module.icon];
  const pathname = usePathname();

  if (module.href) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Link
            data-active={module.isActive(pathname)}
            href={module.href}
            className="group flex items-center justify-center gap-3 px-4 py-3 hover:bg-white/10 data-[active=true]:bg-white/10 rounded"
          >
            <Icon className="w-5 stroke-white fill-white/90 group-data-[active=true]:stroke-2" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <Paragraph className="text-white/90 font-normal group-data-[active=true]:text-white">
            {module.title}
          </Paragraph>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="group grid gap-2 pb-3 border-b-[0.1px] border-white/20  duration-300">
      {/* <Paragraph className="px-4 text-xs text-white/60 uppercase group-data-[active=true]:text-white">
        {module.title}
      </Paragraph> */}
      <div className="grid gap-0">
        {module.submodules.map((submodule) => (
          <SidebarItem key={submodule.title} module={submodule} />
        ))}
      </div>
    </div>
  );
};
