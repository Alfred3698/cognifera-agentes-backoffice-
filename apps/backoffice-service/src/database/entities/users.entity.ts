import { MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: number;

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
}
