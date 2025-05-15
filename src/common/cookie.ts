import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';


@Injectable()
export class Cookie {
  sendToken(response: Response, tokenName: string, token: string) {
    const isProd = process.env.NODE_ENV === 'production';

    const cookie = [
      `${tokenName}=${token}`,
      'Path=/',
      'Max-Age=' + 7 * 24 * 60 * 60,
      'SameSite=None',
      'Secure',
      'HttpOnly',
      'Partitioned',
    ].join('; ');

    response.setHeader('Set-Cookie', cookie);
  }

  getCookie(request: any, tokenName: string) {
    const token = request.cookies?.[tokenName];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return token;
  }
}

// @Injectable()
// export class Cookie {
//   sendToken(response: Response, tokenName: string, token: string) {
//     response.cookie(tokenName, token, {
//       httpOnly: false,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'none',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//   }

//   getCookie(request: any, tokenName: string) {
//     const token = request.cookies?.[tokenName];
//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }
//     return token;
//   }
// }
