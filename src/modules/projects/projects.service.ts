import { Injectable, Inject } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';

import { Project } from './projects.entity';
import { CreateProjectDto } from './projects.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: typeof Project,
  ) {}

  // DATABASE METHODS

  async getCurrentProjectForPk(pk: string) {
    return this.projectRepository.findByPk(pk);
  }

  async getCurrentProject(options: FindOptions) {
    return this.projectRepository.findOne(options);
  }

  async getListOfProjects(options: FindOptions) {
    return this.projectRepository.findAll(options);
  }

  async createProject(data: CreateProjectDto, transaction: Transaction = null) {
    return this.projectRepository.create({ ...data }, { transaction });
  }

  async updateProject(
    id: string,
    data: Omit<CreateProjectDto, 'ownerId'>,
    transaction: Transaction = null,
  ) {
    await this.projectRepository.update(
      { ...data },
      { where: { id }, transaction },
    );
    return this.getCurrentProjectForPk(id);
  }

  async deleteproject(id: string, transaction: Transaction = null) {
    return this.projectRepository.destroy({ where: { id }, transaction });
  }
}
