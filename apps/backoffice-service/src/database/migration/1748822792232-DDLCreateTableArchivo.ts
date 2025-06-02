import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLCreateTableArchivo1748822792232 implements MigrationInterface {
  name = 'DDLCreateTableArchivo1748822792232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "archivo" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "path" character varying NOT NULL, "type" character varying, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "user_v2_id" uuid, CONSTRAINT "PK_635ec16a167251dabbd41681555" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "archivo" ADD CONSTRAINT "FK_56af85b56a0d324cff54b2da612" FOREIGN KEY ("user_v2_id") REFERENCES "user_v2"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_v2" ADD CONSTRAINT "FK_4c018bc0e30ff8f20653fbdb956" FOREIGN KEY ("agente_id") REFERENCES "agentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_v2" DROP CONSTRAINT "FK_4c018bc0e30ff8f20653fbdb956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "archivo" DROP CONSTRAINT "FK_56af85b56a0d324cff54b2da612"`,
    );
    await queryRunner.query(`DROP TABLE "archivo"`);
  }
}
