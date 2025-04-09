import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  defaults: {
    from: `"No Reply" <${process.env.MAIL_USER}>`,
  },
};
