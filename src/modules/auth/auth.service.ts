import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../users/users.service';

import { RedisService } from '../../services/redis/redis.service';

import {
  ReqUser,
  Tokens,
  RefreshBody,
  LoginBody,
  RegisterBody,
  AuthorisedUser,
} from './auth.types';

@Injectable()
export class AuthService {
  private readonly accessJwtSecret: string;
  private readonly refreshJwtSecret: string;
  private readonly accessJwtTtl: number;
  private readonly refreshJwtTtl: number;
  private readonly frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {
    this.accessJwtSecret = this.configService.get('jwt.accessSecret');
    this.refreshJwtSecret = this.configService.get('jwt.refreshSecret');
    this.accessJwtTtl = this.configService.get('jwt.accessTtl');
    this.refreshJwtTtl = this.configService.get('jwt.refreshTtl');
    this.frontendUrl = this.configService.get('frontend.url');
  }

  async loginUser(data: LoginBody): Promise<Tokens> {
    const user = await this.usersService.verifyUser(data);
    return this.generateTokens({ id: user.id });
  }

  async signupUser(data: RegisterBody): Promise<AuthorisedUser> {
    const user = await this.usersService.registerUser(data);
    const tokens = await this.generateTokens({ id: user.id });
    console.log(user);
    return { tokens, user };
  }

  async getUserfromTokenGuard(id: string) {
    return this.usersService.getCurrentUserForPk(id);
  }

  async generateTokens(user: ReqUser): Promise<Tokens> {
    const accessToken: string = this.jwtService.sign(user, {
      secret: this.accessJwtSecret,
      expiresIn: `${this.accessJwtTtl}m`,
    });
    const refreshToken: string = this.jwtService.sign(user, {
      secret: this.refreshJwtSecret,
      expiresIn: `${this.refreshJwtTtl}m`,
    });

    await this.redisService.set(
      `refresh_${user.id}`,
      refreshToken,
      this.refreshJwtTtl * 60,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: ReqUser, data: RefreshBody): Promise<Tokens> {
    const refreshToken: string = await this.redisService.del(
      `refresh_${user.id}`,
    );

    if (refreshToken !== data.token) {
      throw Error('Invalide token!');
    }

    return this.generateTokens(user);
  }

  async googleLogin(req, res) {
    if (!req.user) {
      return 'No user';
    }
    //TODO add check user before create lul
    const userWithThisEmail = await this.usersService.getCurrentUser({
      where: { email: req.user.email },
    });
    if (userWithThisEmail) {
      if (userWithThisEmail.password) {
        throw new BadRequestException('User with this email already created');
      }
      const tokens = await this.generateTokens({ id: userWithThisEmail.id });

      return res.redirect(
        `${this.frontendUrl}/success?accessToken=${tokens.accessToken}`,
      );
    }
    const user = await this.usersService.registerUser(req.user, true);

    const tokens = await this.generateTokens({ id: user.id });

    return res.redirect(
      `${this.frontendUrl}/success?accessToken=${tokens.accessToken}`,
    );
  }
}
