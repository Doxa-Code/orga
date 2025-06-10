import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import config from "../config";

interface MailDriver {
  setFrom(from: string, name: string): void;
  send(to: string, subject: string, message: string): Promise<void>;
}

export class MailerSendMailDriver implements MailDriver {
  static from: string;
  private mailersend = new MailerSend({
    apiKey: config.get("mailsender.api_key"),
  });

  private params = new EmailParams();

  setFrom(from: string, name: string): void {
    this.params.setFrom(new Sender(from, name));
  }

  async send(to: string, subject: string, message: string): Promise<void> {
    this.params
      .setTo([new Recipient(to)])
      .setSubject(subject)
      .setHtml(message);
    this.mailersend.email.send(this.params);
  }
}
