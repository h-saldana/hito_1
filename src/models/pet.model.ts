import { Table, Column, Model, PrimaryKey, Default, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
// import { sequelize } from '../config/database';
import { User } from './user.model';

@Table
export class Pet extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uid!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.INTEGER)
  age!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id!: string;

  @BelongsTo(() => User)
  user!: User;
}




