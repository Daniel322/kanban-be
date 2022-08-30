import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  Scopes,
} from 'sequelize-typescript';
import { Project } from '../projects/projects.entity';

import { User } from '../users/users.entity';

import { ProjectUserRole } from './project-users.types';

@Table
export class ProjectsUsers extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId: string;

  @Column({
    type: DataType.ENUM('owner', 'write', 'read'),
    allowNull: false,
    defaultValue: 'write',
  })
  role: ProjectUserRole;
}
