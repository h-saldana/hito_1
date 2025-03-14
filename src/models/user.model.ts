import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import bcrypt from 'bcryptjs';
import { Pet } from "./pet.model";



@Table
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)  
  declare uid: string; 

  @Column(DataType.STRING)  
  declare name: string;

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column(DataType.STRING)  
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)  
  declare password: string;

  @HasMany(() => Post) 
  declare posts: Post[];

  @HasMany(() => Pet) 
  declare pets: Pet[];

  // @BeforeCreate
  // @BeforeUpdate
  // static async hashPassword(instance: User) {
  //   if (instance.changed('password') && instance.password) {
  //     const salt = await bcrypt.genSalt(10);
  //     instance.password = await bcrypt.hash(instance.password, salt);

  //     return instance
  //   }
  //   const salt = await bcrypt.genSalt(10);
  //   instance.password = await bcrypt.hash(instance.password, salt);
  //   // agregamos esta linea para en caso else, hashe el password;
  // }
}

@Table
export class Post extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)  
  declare title: string;

  @AllowNull(false)
  @Column(DataType.STRING)  
  declare content: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)  
  declare userId: string;

  @BelongsTo(() => User)  
  declare user: User;
}



