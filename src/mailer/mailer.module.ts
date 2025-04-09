import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './mailer.config';
import { AppMailerService } from './mailer.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [AppMailerService],
  exports: [AppMailerService],
})
export class AppMailerModule {}
