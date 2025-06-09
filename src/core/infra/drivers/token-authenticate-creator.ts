import * as jwt from "jsonwebtoken";

export interface TokenCreatorDriver<T> {
  create(payload: T): string;
  verify(token?: string): boolean;
  decoder(token: string): T | null;
}

export class JWTTokenCreatorDriver<T> implements TokenCreatorDriver<T> {
  private secret = "password-orga";

  create(payload: T): string {
    const registeredDate = new Date();
    registeredDate.setDate(registeredDate.getDate() + 1);

    return jwt.sign(
      { ...payload, registeredAt: registeredDate.getTime() },
      this.secret,
    );
  }

  verify(token?: string): boolean {
    try {
      jwt.verify(token || "", this.secret);
      return true;
    } catch {
      return false;
    }
  }

  decoder(token: string): T | null {
    try {
      return jwt.decode(token) as T;
    } catch {
      return null;
    }
  }
}
