import * as AllIcons from "@/components/common/icons";
import { Paragraph } from "@/components/common/typograph";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Module } from "./module";

export const SidebarItem = ({ module }: { module: Module }) => {
  const Icon = (AllIcons as any)[module.icon];
  const pathname = usePathname();

  if (module.href) {
    return (
      <Link
        data-active={module.isActive(pathname)}
        href={module.href}
        className="group flex h-12 items-center gap-3 px-6 hover:bg-background data-[active=true]:bg-primary/15"
      >
        <Icon className="w-5 text-gray-900 group-data-[active=true]:text-primary group-data-[active=true]:stroke-2" />
        <Paragraph className="text-sm font-light text-gray-900 group-data-[active=true]:font-medium group-data-[active=true]:text-primary">
          {module.title}
        </Paragraph>
      </Link>
    );
  }

  return (
    <div className="group grid space-y-2 duration-300">
      <Paragraph className="px-6 text-sm group-data-[active=true]:text-white">
        {module.title}
      </Paragraph>
      <div className="grid gap-1">
        {module.submodules.map((submodule) => (
          <SidebarItem key={submodule.title} module={submodule} />
        ))}
      </div>
    </div>
  );
};
