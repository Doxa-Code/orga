interface PersistDriver {
  set(key: string, value: string | null): void;
  get(key: string): string | null;
}

export class ManagerTokenService {
  static keyName = "x-orga-token";

  constructor(private readonly persistDriver: PersistDriver) {}

  saveToken(token: string) {
    this.persistDriver.set(ManagerTokenService.keyName, token);
  }

  getToken() {
    return this.persistDriver.get(ManagerTokenService.keyName);
  }

  deleteToken() {
    this.persistDriver.set(ManagerTokenService.keyName, null);
  }
}
