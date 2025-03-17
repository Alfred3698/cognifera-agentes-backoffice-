import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLCreationTableUser1722532866090 implements MigrationInterface {
  name = 'DDLCreationTableUser1722532866090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
