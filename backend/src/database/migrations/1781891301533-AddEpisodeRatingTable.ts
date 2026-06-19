import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEpisodeRatingTable1781891301533 implements MigrationInterface {
    name = 'AddEpisodeRatingTable1781891301533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "episode_rating" ("id" SERIAL NOT NULL, "episode_id" integer NOT NULL, "user_id" integer NOT NULL, "score_story" numeric(7,5) NOT NULL, "score_animation" numeric(7,5) NOT NULL, "score_music" numeric(7,5) NOT NULL, "score_characters" numeric(7,5) NOT NULL, "final_score" numeric(7,5) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0876b2611591f152065558ad72f" UNIQUE ("episode_id", "user_id"), CONSTRAINT "PK_28610b3306d2ce49ecbb17e0462" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "episode_rating" ADD CONSTRAINT "FK_b0938986d3f57b34b3a1893c4ad" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "episode_rating" ADD CONSTRAINT "FK_76b782764b6a44cc1fb6d0dfae2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "episode_rating" DROP CONSTRAINT "FK_76b782764b6a44cc1fb6d0dfae2"`);
        await queryRunner.query(`ALTER TABLE "episode_rating" DROP CONSTRAINT "FK_b0938986d3f57b34b3a1893c4ad"`);
        await queryRunner.query(`DROP TABLE "episode_rating"`);
    }

}
