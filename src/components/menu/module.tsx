import type * as AllIcons from "@/components/icons";

interface ModuleProps {
  title: string;
  description: string;
  icon: keyof typeof AllIcons;
  href: string;
  submodules: Module[];
}

export class Module {
  public title: string;
  public description: string;
  public icon: keyof typeof AllIcons;
  public href: string;
  public submodules: Module[];
  private _isSubModule!: boolean;

  constructor(props: ModuleProps) {
    this.title = props.title;
    this.description = props.description;
    this.icon = props.icon;
    this.href = props.href;
    this.submodules = props.submodules;
  }

  isActive(route: string) {
    return route.includes(this.href);
  }

  get isSubModule() {
    return !!this._isSubModule;
  }

  transformSubmodule() {
    this._isSubModule = true;
  }

  addSubModule(...submodules: Module[]) {
    for (const submodule of submodules) {
      submodule.transformSubmodule();
      this.submodules.push(submodule);
    }
    return this;
  }

  static create(
    title: string,
    icon: keyof typeof AllIcons | React.ReactNode,
    href?: string,
    description?: string
  ) {
    return new Module({
      title: title || "",
      description: description || "",
      icon: icon as keyof typeof AllIcons,
      href: href || "",
      submodules: [],
    });
  }
}
