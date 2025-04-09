import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer/lib/stream-transport';

@Injectable()
export class AppMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, body: string) {
    const status = (await this.mailerService.sendMail({
      to,
      subject,
      text: body,
    })) as SentMessageInfo;

    if (status.response && !status.response.includes('OK')) {
      throw new InternalServerErrorException('Email not sent');
    }
  }
}
