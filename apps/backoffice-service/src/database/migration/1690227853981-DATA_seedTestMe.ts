import { MigrationInterface, QueryRunner } from 'typeorm';

export class DATASeedTestMe1690227853981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.test_me(descripcion) VALUES('testMe')`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
