import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserV2 } from './user.entity';

@Entity({})
export class Archivo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'path' })
  path: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @ManyToOne(() => UserV2, (user) => user.archivo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_v2_id' })
  user: UserV2;

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

  @Column({ nullable: true })
  hash: string;
}
