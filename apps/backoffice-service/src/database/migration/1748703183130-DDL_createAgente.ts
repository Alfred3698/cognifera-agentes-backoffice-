import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLCreateAgente1748703183130 implements MigrationInterface {
  name = 'DDLCreateAgente1748703183130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agentes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "descripcion" character varying, "activo" boolean NOT NULL DEFAULT true, "archivos_allowed" boolean NOT NULL DEFAULT false, "whatsapp_allowed" boolean NOT NULL DEFAULT false, "widget_allowed" boolean NOT NULL DEFAULT false, "ius_gpt_allowed" boolean NOT NULL DEFAULT false, "buscador_allowed" boolean NOT NULL DEFAULT false, "modelo_embedding" character varying, "temperatura" integer NOT NULL DEFAULT '0', "idioma" character varying, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "modelo_conversacional" character varying, CONSTRAINT "PK_db5be2f9a185bfff6f732bcb924" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_v2" DROP CONSTRAINT "FK_4c018bc0e30ff8f20653fbdb956"`,
    );
    await queryRunner.query(`ALTER TABLE "user_v2" DROP COLUMN "agente_id"`);
    await queryRunner.query(`DROP TABLE "agentes"`);
  }
}
