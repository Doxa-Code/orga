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
  const Icon =
    typeof module.icon === "string"
      ? (AllIcons as any)[module.icon]
      : module.icon;
  const pathname = usePathname();

  if (module.href) {
    return (
      <Tooltip>
        <TooltipTrigger disabled>
          <Link
            data-active={module.isActive(pathname)}
            href={module.href}
            className="group flex px-3 items-center border-l-4 border-transparent data-[active=true]:border-[#2687E9]  justify-start gap-3"
          >
            <div className="group-data-[active=true]:bg-[#2687E9]/10 group-hover:bg-[#2687E9]/10 p-4 rounded-md">
              <Icon className="w-5 stroke-[#989AA4] group-hover:stroke-[#2687E9] group-data-[active=true]:stroke-[#2687E9]" />
            </div>
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
    <>
      {module.submodules.map((submodule) => (
        <SidebarItem key={submodule.title} module={submodule} />
      ))}
    </>
  );
};
