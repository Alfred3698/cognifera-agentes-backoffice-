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
import { Archivo } from './archivo.entity';
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

  @OneToMany(() => Archivo, (archivo) => archivo.user, {
    onDelete: 'CASCADE',
  })
  archivo: Archivo[];

  // Campo para guardar el token de confirmación
  @Column({ name: 'confirmation_token', nullable: true })
  confirmationToken?: string;

  // Campo para guardar la fecha de expiración del token
  @Column({
    name: 'confirmation_token_expires_at',
    type: 'timestamp',
    nullable: true,
  })
  confirmationTokenExpiresAt?: Date;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;
}
