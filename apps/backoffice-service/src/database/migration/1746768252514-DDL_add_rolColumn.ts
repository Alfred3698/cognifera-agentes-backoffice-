import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLAddRolColumn1746768252514 implements MigrationInterface {
  name = 'DDLAddRolColumn1746768252514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }
}
