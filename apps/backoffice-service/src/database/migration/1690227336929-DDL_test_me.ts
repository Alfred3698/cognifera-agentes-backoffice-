import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLTestMe1690227336929 implements MigrationInterface {
  name = 'DDLTestMe1690227336929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "test_me" ("id" SERIAL NOT NULL, "descripcion" character varying NOT NULL, CONSTRAINT "PK_f8fd17faa3529bebf26856bd574" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "test_me"`);
  }
}
