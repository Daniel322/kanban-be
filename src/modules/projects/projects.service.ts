import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { ProjectUsersService } from '../projects-users/project-users.service';
import { ProjectUserRole } from '../projects-users/project-users.types';

import { Project } from './projects.entity';
import { CreateProjectDto } from './projects.dto';
import { User } from '../users/users.entity';
import { ProjectsUsers } from '../projects-users/project-users.entity';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: typeof Project,
    private readonly projectUsersService: ProjectUsersService,
    private sequelize: Sequelize,
  ) {}

  async createProjectAndMembers(data: CreateProjectDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const project = await this.createProject(data, transaction);
      const projectOwner = {
        userId: data.ownerId,
        projectId: project.id,
        role: ProjectUserRole.Owner,
      };
      await this.projectUsersService.createProjectUsers(
        [projectOwner],
        transaction,
      );

      await transaction.commit();

      return this.getCurrentProject({
        where: { id: project.id },
        include: [
          {
            model: User,
            as: 'owner',
            attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
          },
          {
            model: User,
            as: 'members',
            attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
            through: { attributes: ['role'] },
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error);
    }
  }

  async getListOfUsersProjects(userId: string) {
    return this.getListOfProjects({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
        },
        {
          model: User,
          as: 'members',
          attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
          through: { attributes: ['role'], where: { userId } },
        },
      ],
    });
  }

  async getOwnerProjectsList(userId: string) {
    return this.getListOfProjects({
      where: { ownerId: userId },
      attributes: ['id', 'name', 'ownerId'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
        },
        {
          model: User,
          as: 'members',
          attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
          through: {
            attributes: ['role'],
          },
          // attributes: [
          //   [Sequelize.fn('COUNT', Sequelize.col('email')), 'members_count'],
          // ],
        },
      ],
    });
  }

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
