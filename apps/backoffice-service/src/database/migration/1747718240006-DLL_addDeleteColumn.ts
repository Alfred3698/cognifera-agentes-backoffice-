import { MigrationInterface, QueryRunner } from 'typeorm';

export class DLLAddDeleteColumn1747718240006 implements MigrationInterface {
  name = 'DLLAddDeleteColumn1747718240006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
  }
}
