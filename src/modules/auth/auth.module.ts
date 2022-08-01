import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  GoogleStrategy,
} from '../../common/guards';

import { RedisModule } from '../../services/redis/redis.module';

import { UserModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PassportModule,
    RedisModule,
    UserModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
