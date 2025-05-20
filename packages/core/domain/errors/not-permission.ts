export class NotPermission extends Error {
  constructor() {
    super("Você não ter permissão para fazer essa ação!");
    this.name = "NotPermission";
  }
}
