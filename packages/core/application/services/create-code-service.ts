interface CacheDriver {
  create(key: string, value: string): Promise<void>;
}

export class CreateCodeService {
  constructor(private readonly cacheDriver: CacheDriver) {}

  async execute(email: string) {
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    await this.cacheDriver.create(email, code.toString());
    return code.toString();
  }
}
