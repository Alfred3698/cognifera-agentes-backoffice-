import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLUser1750261364448 implements MigrationInterface {
  name = 'DDLUser1750261364448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_v2" ADD "confirmation_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_v2" ADD "confirmation_token_expires_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_v2" ADD "is_active" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_v2" DROP COLUMN "is_active"`);
    await queryRunner.query(
      `ALTER TABLE "user_v2" DROP COLUMN "confirmation_token_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_v2" DROP COLUMN "confirmation_token"`,
    );
  }
}
