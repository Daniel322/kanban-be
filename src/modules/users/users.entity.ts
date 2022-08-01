import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Scopes,
} from 'sequelize-typescript';

@Table
@Scopes(() => ({
  list: {
    attributes: ['id', 'email', 'firstName', 'lastName', 'avatarKey'],
  },
  current: {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  },
}))
export class User extends Model {
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
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatarKey: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;
}
