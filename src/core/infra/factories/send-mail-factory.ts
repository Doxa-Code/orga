import { SendMailService } from "../../application/services/send-mail-service";
import { MailerSendMailDriver } from "../drivers/mail-driver";

export class SendMailFactory {
  static sendMailService() {
    return new SendMailService(new MailerSendMailDriver());
  }
}
