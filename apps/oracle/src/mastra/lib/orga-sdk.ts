export class OrgaSDK {
  private readonly client: AxiosInstance;

  constructor() {}

  static create() {
    return new OrgaSDK();
  }
}
