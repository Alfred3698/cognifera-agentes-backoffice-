import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLCreateUserV21748401622869 implements MigrationInterface {
  name = 'DDLCreateUserV21748401622869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_v2" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "password" character varying NOT NULL, "correo" character varying NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_0fd0509727529929c5f7d256d68" UNIQUE ("correo"), CONSTRAINT "PK_102f37816225c577e3c06c51bb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" SERIAL NOT NULL, "users_v2_id" uuid NOT NULL, "size_fragment" integer NOT NULL DEFAULT '500', "size_chunks" integer NOT NULL DEFAULT '1000', "overlap" integer NOT NULL DEFAULT '150', "temperature" double precision NOT NULL DEFAULT '0.6', "model_embedding" character varying NOT NULL DEFAULT 'text-embedding-3-small', "model_conversation" character varying NOT NULL DEFAULT 'gpt-4.1-nano', "contexto_conversacional" text NOT NULL DEFAULT 'Eres un asistente jurídico Mexicano.', CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_eb2a7e2b13d692c46ddcd3cee4f" FOREIGN KEY ("users_v2_id") REFERENCES "user_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_eb2a7e2b13d692c46ddcd3cee4f"`,
    );
    await queryRunner.query(`DROP TABLE "user_settings"`);
    await queryRunner.query(`DROP TABLE "user_v2"`);
  }
}
