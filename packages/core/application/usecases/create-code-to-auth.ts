import { AuthenticateInvalid } from "../../domain/errors/authenticate-invalid";
import { Email } from "../../domain/valueobjects/email";
import type { UserRaw } from "../mappers/user-mapper";

interface UserRepository {
  retrieveByEmail(email: Email): Promise<UserRaw | null>;
}

interface SendMailService {
  sendMail(email: string, title: string, content: string): Promise<void>;
}

interface CreateCodeService {
  execute(email: string): Promise<string>;
}

export class CreateCodeToAuthenticate {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly sendMailService: SendMailService,
    private readonly createCodeService: CreateCodeService,
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.retrieveByEmail(
      Email.create(email),
    );

    if (!user) {
      throw new AuthenticateInvalid();
    }

    const code = await this.createCodeService.execute(email);

    await this.sendMailService.sendMail(
      email,
      "Seu código para autenticar no Budget Saas",
      `<table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
          <tr>
              <td style="padding: 20px; text-align: center; background-color: #f0f0f0;">
                  <h2 style="color: #333333; font-family: Arial;">Código de Autenticação</h2>
              </td>
          </tr>
          <tr>
              <td style="padding: 40px; text-align: center; background-color: #ffffff;">
                  <p style="font-size: 18px; color: #333333; font-family: Arial;">Seu código de autenticação é:</p>
                  <h1 style="font-size: 48px; color: #007bff; margin: 20px 0; font-family: Arial;">${code}</h1>
                  <p style="font-size: 16px; color: #333333; font-family: Arial;">Por favor, use este código para autenticar sua conta.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; text-align: center; background-color: #f0f0f0;">
                  <p style="font-size: 14px; color: #888888; font-family: Arial;">Este é um email automático. Por favor, não responda.</p>
              </td>
          </tr>
      </table>`,
    );
  }
}
