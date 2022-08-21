import { Injectable, Inject } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';

import { ProjectUserData } from './project-users.types';

import { ProjectsUsers } from './project-users.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @Inject('ROJECT-USERS_REPOSITORY')
    private readonly projectUsersRepository: typeof ProjectsUsers,
  ) {}

  async createProjectUsers(
    data: readonly Partial<ProjectUserData>[],
    transaction: Transaction = null,
  ) {
    return this.projectUsersRepository.bulkCreate(data, { transaction });
  }
}
