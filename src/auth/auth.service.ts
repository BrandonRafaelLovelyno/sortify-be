import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './auth.dto';
import { AppMailerService } from 'src/mailer/mailer.service';
import { Token } from 'src/common/token';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private emailService: AppMailerService,
    private token: Token,
  ) {}

  async signUp(body: SignUpDto) {
    const signUpRequest = await this.createSignUpRequest(body);
    const jwtToken = this.token.generateToken(signUpRequest.id);

    await this.emailService.sendEmail(
      body.email,
      'Email Verification',
      jwtToken,
    );
  }

  private async createSignUpRequest(body: SignUpDto) {
    return this.prismaService.signUpRequest.create({
      data: {
        email: body.email,
        hashedPassword: body.hashedPassword,
        name: body.name,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    });
  }
}
