import { Module } from '@nestjs/common';

import { ProjectUsersModule } from '../projects-users/project-users.module';

import { ProjectController } from './projects.controller';
import { projectProviders } from './projects.providers';
import { ProjectService } from './projects.service';

@Module({
  imports: [ProjectUsersModule],
  controllers: [ProjectController],
  providers: [ProjectService, ...projectProviders],
  exports: [ProjectService],
})
export class ProjectModule {}
