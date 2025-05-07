import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto, VerifyUserDto, SignInDto } from './auth.dto';
import { AppMailerService } from 'src/mailer/mailer.service';
import { Token } from 'src/common/token';
import { Response } from 'express';
import { AuthHelper } from './auth.helper';
import { Cookie } from 'src/common/cookie';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private authHelper: AuthHelper,
    private emailService: AppMailerService,
    private token: Token,
    private cookie: Cookie,
    private userService: UserService,
  ) {}

  async signUp(body: SignUpDto) {
    const existingRequest = await this.authHelper.checkExistingSignUpRequest(
      body.email,
    );
    if (existingRequest) {
      throw new ConflictException(
        'Email already has a pending sign up request',
      );
    }

    const signUpRequest = await this.authHelper.createSignUpRequest(body);
    const jwtToken = this.token.generateToken(signUpRequest.id);

    await this.emailService.sendEmail(
      body.email,
      'Email Verification',
      jwtToken,
    );
  }

  async verifyUser(body: VerifyUserDto) {
    const signUpRequestId = this.token.verifyToken(body.token);

    const signUpRequest =
      await this.authHelper.findSignUpRequestById(signUpRequestId);
    if (!signUpRequest) {
      throw new NotFoundException('Invalid verification token');
    }

    const user = await this.authHelper.createUser(
      signUpRequest.email,
      signUpRequest.hashedPassword,
      signUpRequest.name,
    );

    await this.authHelper.deleteSignUpRequest(signUpRequestId);
    return user;
  }

  async login(body: SignInDto, response: Response) {
    const user = await this.authHelper.findUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await this.authHelper.comparePasswords(
      body.password,
      user.hashedPassword,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.token.generateToken(user.id);
    this.cookie.sendToken(response, 'auth_token', token);

    return user;
  }

  async verifySession(token: string): Promise<void> {
    try {
      const decodedToken = this.token.verifyToken(token);

      const userId = decodedToken;

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
