import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { AuthTokenPayload } from './interfaces/authTokenPayload.interface';
import { REFRESH_TOKEN } from '../utils/constants';
import { RefreshTokenPayload } from './interfaces/refreshTokenPayload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies[REFRESH_TOKEN];

    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException('Please login.');
    }

    try {
      verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

      const accessTokenDecoded = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as AuthTokenPayload;

      req.user = accessTokenDecoded.user;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token.');
    }

    next();
  }
}
