import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import nodemailer from "nodemailer";
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

export class MailHugMailDriver implements MailDriver {
  static from: string;
  private readonly transporter = nodemailer.createTransport({
    host: "localhost",
    port: "1025",
    auth: null,
  } as any);

  setFrom(from: string, name: string): void {
    MailHugMailDriver.from = `${name} <${from}>`;
  }

  async send(to: string, subject: string, message: string): Promise<void> {
    const mailOptions = {
      from: MailHugMailDriver.from,
      to,
      subject,
      html: message,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
