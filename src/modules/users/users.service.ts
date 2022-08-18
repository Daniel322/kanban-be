import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FindOptions, Transaction, Op } from 'sequelize';

import { BcryptService } from '../../services/bcrypt/bcrypt.service';

import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: typeof User,
  ) {}

  // LOGIC METHODS

  async registerUser(data: CreateUserDto, isSocial = false) {
    try {
      if (isSocial) {
        return this.createUser(data);
      }
      const { password } = data;
      const passwordHash = await this.bcryptService.hash(password);
      return this.createUser({ ...data, password: passwordHash });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async verifyUser({ email, password }) {
    const user = await this.getCurrentUser({ where: { email }, raw: true });
    const isValidPassword = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Wrong password!');
    }
    return user;
  }

  // DATABASE LEVEL METHODS

  async getCurrentUserForPk(pk: string) {
    return this.usersRepository.findByPk(pk);
  }

  async getCurrentUser(options: FindOptions) {
    return this.usersRepository.findOne(options);
  }

  async createUser(
    data: CreateUserDto,
    transaction: Transaction = null,
    raw = true,
  ) {
    return this.usersRepository.create({ ...data }, { transaction, raw });
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
    transaction: Transaction = null,
  ) {
    return this.usersRepository.update(
      { ...data },
      { where: { id }, transaction },
    );
  }

  async deleteUser(id: string, transaction: Transaction = null) {
    return this.usersRepository.destroy({ where: { id }, transaction });
  }
}
