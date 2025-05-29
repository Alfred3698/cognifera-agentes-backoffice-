import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLAlterUserComoAgente1748402470335 implements MigrationInterface {
  name = 'DDLAlterUserComoAgente1748402470335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_v2" ADD "agente_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_v2" ADD CONSTRAINT "FK_4c018bc0e30ff8f20653fbdb956" FOREIGN KEY ("agente_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_v2" DROP CONSTRAINT "FK_4c018bc0e30ff8f20653fbdb956"`,
    );
    await queryRunner.query(`ALTER TABLE "user_v2" DROP COLUMN "agente_id"`);
  }
}
