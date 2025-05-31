import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserV2 } from './user.entity';

@Entity({ name: 'agentes' })
export class Agente {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'descripcion', nullable: true })
  descripcion: string;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @Column({ name: 'archivos_allowed', default: false })
  archivosAllowed: boolean;

  @Column({ name: 'whatsapp_allowed', default: false })
  whatsappAllowed: boolean;

  @Column({ name: 'widget_allowed', default: false })
  widgetAllowed: boolean;

  @Column({ name: 'ius_gpt_allowed', default: false })
  iusGptAllowed: boolean;

  @Column({ name: 'buscador_allowed', default: false })
  buscadorAllowed: boolean;

  @Column({ name: 'modelo_embedding', nullable: true })
  modeloEmbedding: string;

  @Column({ name: 'temperatura', default: 0.0, type: 'double precision' })
  temperatura: number;

  @Column({ name: 'idioma', nullable: true })
  idioma: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column({ name: 'modelo_conversacional', nullable: true })
  modeloConversacional: string;

  @OneToMany(() => UserV2, (userV2) => userV2.agente)
  userV2?: UserV2[];
}
