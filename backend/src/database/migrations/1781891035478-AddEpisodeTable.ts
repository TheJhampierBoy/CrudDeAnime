import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEpisodeTable1781891035478 implements MigrationInterface {
    name = 'AddEpisodeTable1781891035478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "episode" ("id" SERIAL NOT NULL, "season_id" integer NOT NULL, "number" smallint NOT NULL, "title" character varying(255), "synopsis" text, "aired_at" date, "duration_sec" integer, "avg_score" numeric(7,5) NOT NULL DEFAULT '0', "ratings_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7308d4a1d76fd8853bdbb76b03b" UNIQUE ("season_id", "number"), CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "episode" ADD CONSTRAINT "FK_d8790eefed71394952672828c1c" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "episode" DROP CONSTRAINT "FK_d8790eefed71394952672828c1c"`);
        await queryRunner.query(`DROP TABLE "episode"`);
    }

}
