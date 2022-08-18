import { Module } from '@nestjs/common';

import { projectUsersProviders } from './project-users.providers';
import { ProjectUsersService } from './project-users.service';

@Module({
  providers: [ProjectUsersService, ...projectUsersProviders],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}
