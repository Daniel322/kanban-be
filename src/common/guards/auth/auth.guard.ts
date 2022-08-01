import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ReqUser } from '../../../modules/auth/auth.types';

interface JwtPayload extends ReqUser {
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<ReqUser> {
    return { id: payload.id };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<ReqUser> {
    return { id: payload.id };
  }
}

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  handleRequest(_, user) {
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest(_, user) {
    if (!user) {
      throw new UnauthorizedException('Invalide token!');
    }

    return user;
  }
}
