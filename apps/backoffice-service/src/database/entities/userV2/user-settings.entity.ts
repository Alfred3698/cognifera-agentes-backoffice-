import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserV2 } from './user.entity';

@Entity({ name: 'user_settings' })
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'users_v2_id', type: 'uuid' })
  usersV2Id: string;

  @ManyToOne(() => UserV2, (user) => user.settings)
  @JoinColumn({ name: 'users_v2_id' })
  user: UserV2;

  @Column({ name: 'size_fragment', type: 'int', default: 500 })
  sizeFragment: number;

  @Column({ name: 'size_chunks', type: 'int', default: 1000 })
  sizeChunks: number;

  @Column({ name: 'overlap', type: 'int', default: 150 })
  overlap: number;

  @Column({ name: 'temperature', type: 'float', default: 0.6 })
  temperature: number;

  @Column({
    name: 'model_embedding',
    type: 'varchar',
    default: 'text-embedding-3-small',
  })
  modelEmbedding: string;

  @Column({
    name: 'model_conversation',
    type: 'varchar',
    default: 'gpt-4.1-nano',
  })
  modelConversation: string;

  @Column({
    name: 'contexto_conversacional',
    type: 'text',
    default: 'Eres un asistente jurídico Mexicano.',
  })
  contextoConversacional: string;
}
