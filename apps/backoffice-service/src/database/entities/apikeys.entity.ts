import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity'; // Importa la entidad Users

@Entity({})
export class ApiKeys {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'key', unique: true })
  key: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
  })
  createdAt?: Date;

  // Relación con Users
  @ManyToOne(() => Users, (user) => user.apiKeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
