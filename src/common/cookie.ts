import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class Cookie {
  sendToken(response: Response, tokenName : string, token: string) {
    response.cookie(tokenName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
}