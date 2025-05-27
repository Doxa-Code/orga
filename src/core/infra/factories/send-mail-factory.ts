import { SendMailService } from "../../application/services/send-mail-service";
import {
  MailHugMailDriver,
  MailerSendMailDriver,
} from "../drivers/mail-driver";

export class SendMailFactory {
  static sendMailService() {
    return new SendMailService(
      process.env.NODE_ENV === "development"
        ? new MailHugMailDriver()
        : new MailerSendMailDriver(),
    );
  }
}
