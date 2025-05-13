import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class Cookie {
  sendToken(response: Response, tokenName: string, token: string) {
    response.cookie(tokenName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  getCookie(request: any, tokenName: string) {
    const token = request.cookies?.[tokenName];
    if (!token) {
      throw new Error('No token provided');
    }
    return token;
  }
}
