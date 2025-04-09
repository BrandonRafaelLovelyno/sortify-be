import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Token {
  private saltRounds: number;
  private jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.saltRounds = Number(this.configService.get('SALT_ROUND')) || 10;
    this.jwtSecret = String(this.configService.get('JWT_SECRET'));
  }

  async hashToken(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compareHashedToken(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }

  generateToken(data: string): string {
    return jwt.sign({ data }, this.jwtSecret);
  }
}
