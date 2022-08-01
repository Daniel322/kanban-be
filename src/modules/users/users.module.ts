import { Module } from '@nestjs/common';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

import { userProviders } from './users.providers';
import { UserService } from './users.service';

@Module({
  imports: [BcryptModule],
  controllers: [],
  exports: [UserService],
  providers: [UserService, ...userProviders],
})
export class UserModule {}
