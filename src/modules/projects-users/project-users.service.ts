import { Injectable, Inject } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';

import { ProjectUserData } from './project-users.types';

import { ProjectsUsers } from './project-users.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @Inject('PROJECT-USERS_REPOSITORY')
    private readonly projectUsersRepository: typeof ProjectsUsers,
  ) {}

  async createProjectUsers(
    data: Partial<ProjectUserData>[],
    transaction: Transaction = null,
  ) {
    return this.projectUsersRepository.bulkCreate(data, { transaction });
    // return Promise.all(
    //   data.map(
    //     async (elem) =>
    //       await this.projectUsersRepository.create(elem, { transaction }),
    //   ),
    // );
  }
}
