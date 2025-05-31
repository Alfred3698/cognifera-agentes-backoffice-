import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSettings } from './user-settings.entity';
import { Role } from './role.entity';
import { Agente } from './agente.entity';
@Entity({})
export class UserV2 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ unique: true })
  correo: string;

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => UserSettings, (userSettings) => userSettings.user)
  settings: UserSettings[];

  @ManyToOne(() => Agente, (agente) => agente.userV2, { nullable: true })
  @JoinColumn({ name: 'agente_id' })
  agente?: Agente;

  // Relación con roles (muchos a muchos)
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
