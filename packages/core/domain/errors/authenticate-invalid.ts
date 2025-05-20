export class AuthenticateInvalid extends Error {
  constructor() {
    super("As informações de autenticação estão incorretas!");
    this.name = "AuthenticateInvalid";
  }
}
