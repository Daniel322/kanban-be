import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  BelongsToMany,
  Scopes,
} from 'sequelize-typescript';
import { ProjectsUsers } from '../projects-users/project-users.entity';

import { User } from '../users/users.entity';

@Table
export class Project extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ownerId: string;

  @BelongsToMany(() => User, () => ProjectsUsers)
  members: Array<User & { ProjectsUsers: ProjectsUsers }>;
}
