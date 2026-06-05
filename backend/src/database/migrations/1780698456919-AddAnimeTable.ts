import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnimeTable1780698456919 implements MigrationInterface {
    name = 'AddAnimeTable1780698456919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "anime" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "synopsis" text, "status" character varying(20) NOT NULL, "year" smallint, "cover_url" character varying(500), "avg_score" numeric(7,5) NOT NULL DEFAULT '0', "ratings_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6e567f73ed63fd388a7734cbdd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "anime_genre" ("anime_id" integer NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_767a9c02ef2aa9f6d57873cd607" PRIMARY KEY ("anime_id", "genre_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c947adf4902fca0dd05f0c9c0" ON "anime_genre"  ("anime_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0069a88d41e677c6a39b2c75fd" ON "anime_genre"  ("genre_id") `);
        await queryRunner.query(`ALTER TABLE "anime_genre" ADD CONSTRAINT "FK_1c947adf4902fca0dd05f0c9c04" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "anime_genre" ADD CONSTRAINT "FK_0069a88d41e677c6a39b2c75fd3" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "anime_genre" DROP CONSTRAINT "FK_0069a88d41e677c6a39b2c75fd3"`);
        await queryRunner.query(`ALTER TABLE "anime_genre" DROP CONSTRAINT "FK_1c947adf4902fca0dd05f0c9c04"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0069a88d41e677c6a39b2c75fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c947adf4902fca0dd05f0c9c0"`);
        await queryRunner.query(`DROP TABLE "anime_genre"`);
        await queryRunner.query(`DROP TABLE "anime"`);
    }

}
