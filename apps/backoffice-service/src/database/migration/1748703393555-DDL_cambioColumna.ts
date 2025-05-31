import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLCambionColumna1748703393555 implements MigrationInterface {
  name = 'DDLCambionColumna1748703393555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agentes" DROP COLUMN "temperatura"`);
    await queryRunner.query(
      `ALTER TABLE "agentes" ADD "temperatura" double precision NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agentes" DROP COLUMN "temperatura"`);
    await queryRunner.query(
      `ALTER TABLE "agentes" ADD "temperatura" integer NOT NULL DEFAULT '0'`,
    );
  }
}
