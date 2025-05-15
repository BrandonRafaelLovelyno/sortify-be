import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class Cookie {
  sendToken(response: Response, tokenName: string, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAgeSeconds = 7 * 24 * 60 * 60; // dalam detik
  
    let cookieString = `${tokenName}=${token}; HttpOnly; Secure; Path=/; Max-Age=${maxAgeSeconds}`;
  
    // Tambahkan atribut Partitioned dan SameSite sesuai environment
    if (isProduction) {
      cookieString += '; SameSite=None; Partitioned';
    } else {
      cookieString += '; SameSite=Lax';
    }
  
    response.setHeader('Set-Cookie', cookieString);
  }
  getCookie(request: any, tokenName: string) {
    const token = request.cookies?.[tokenName];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return token;
  }
}
