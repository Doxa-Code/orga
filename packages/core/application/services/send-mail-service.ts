interface MailDriver {
  setFrom(from: string, name: string): void;
  send(to: string, subject: string, message: string): Promise<void>;
}

export class SendMailService {
  constructor(private readonly mailDriver: MailDriver) {
    this.mailDriver.setFrom("no-reply@orga.com.br", "Budget Saas");
  }

  async sendMail(to: string, subject: string, message: string) {
    await this.mailDriver.send(to, subject, message);
  }
}
