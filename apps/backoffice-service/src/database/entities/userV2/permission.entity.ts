import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // Relación con roles (muchos a muchos)
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
