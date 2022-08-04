import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { Project } from '../../modules/projects/projects.entity';
import { ProjectsUsers } from '../../modules/projects-users/project-users.entity';
import { User } from '../../modules/users/users.entity';

export const SequelizeConfig: SequelizeModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    dialect: 'mysql',
    host: configService.get('db.host'),
    port: configService.get('db.port'),
    username: configService.get('db.username'),
    password: configService.get('db.password'),
    database: configService.get('db.name'),
    models: [Project, ProjectsUsers, User],
  }),
  imports: [ConfigModule],
  inject: [ConfigService],
};
