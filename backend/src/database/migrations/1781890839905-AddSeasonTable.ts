import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSeasonTable1781890839905 implements MigrationInterface {
    name = 'AddSeasonTable1781890839905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "season" ("id" SERIAL NOT NULL, "anime_id" integer NOT NULL, "number" smallint NOT NULL, "title" character varying(255), "year" smallint, "avg_score" numeric(7,5) NOT NULL DEFAULT '0', "ratings_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad2b7ecc13fba6498b176788acc" UNIQUE ("anime_id", "number"), CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "season" ADD CONSTRAINT "FK_0e4de2e676ac443d3894658ad0c" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" DROP CONSTRAINT "FK_0e4de2e676ac443d3894658ad0c"`);
        await queryRunner.query(`DROP TABLE "season"`);
    }

}
