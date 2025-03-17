import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({})
export class TestMe {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'descripcion' })
  descripcion: string;
}
