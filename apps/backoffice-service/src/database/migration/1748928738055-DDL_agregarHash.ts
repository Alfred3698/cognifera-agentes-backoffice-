import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLAgregarHash1748928738055 implements MigrationInterface {
  name = 'DDLAgregarHash1748928738055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "archivo" ADD "hash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "archivo" DROP COLUMN "hash"`);
  }
}
