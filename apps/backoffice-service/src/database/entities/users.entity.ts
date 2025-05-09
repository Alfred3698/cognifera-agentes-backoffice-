import { MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiKeys } from './apikeys.entity';

@Entity({})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name', unique: true })
  @MinLength(5)
  userName: string;

  @Column({ name: 'password' })
  password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;

  @OneToMany(() => ApiKeys, (apiKey) => apiKey.user, { cascade: true })
  apiKeys: ApiKeys[];

  @Column({
    name: 'roles',
    type: 'simple-array',
    nullable: true,
    default: null,
  })
  roles: string[] | null;
}
