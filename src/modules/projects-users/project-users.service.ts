import { Injectable, Inject } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';

import { ProjectsUsers } from './project-users.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @Inject('ROJECT-USERS_REPOSITORY')
    private readonly projectUsersRepository: typeof ProjectsUsers,
  ) {}

  async createProjectUsers(data, transaction: Transaction = null) {
    console.log('kek');
  }
}
