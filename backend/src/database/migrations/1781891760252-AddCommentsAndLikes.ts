import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsAndLikes1781891760252 implements MigrationInterface {
    name = 'AddCommentsAndLikes1781891760252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "anime_comment" ("id" SERIAL NOT NULL, "anime_id" integer NOT NULL, "user_id" integer NOT NULL, "body" text NOT NULL, "likes_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec33a95f359bd1785a365445687" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_like" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "target_type" character varying(20) NOT NULL, "target_id" integer NOT NULL, CONSTRAINT "UQ_81c8b2e0b6565cb6f3d4cf99e2b" UNIQUE ("user_id", "target_type", "target_id"), CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "episode_comment" ("id" SERIAL NOT NULL, "episode_id" integer NOT NULL, "user_id" integer NOT NULL, "body" text NOT NULL, "likes_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c2906e62b9adb6b9bdb5271230" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "anime_comment" ADD CONSTRAINT "FK_61a9600a9487cf27ad877208902" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "anime_comment" ADD CONSTRAINT "FK_7aefefc9042fcddd314f26aa87e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_like" ADD CONSTRAINT "FK_fd7207639a77fa0f1fea8943b78" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "episode_comment" ADD CONSTRAINT "FK_f664bb35c5c20fe361274c983ac" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "episode_comment" ADD CONSTRAINT "FK_f1e3e67d99f5507ca342a6b60b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "episode_comment" DROP CONSTRAINT "FK_f1e3e67d99f5507ca342a6b60b4"`);
        await queryRunner.query(`ALTER TABLE "episode_comment" DROP CONSTRAINT "FK_f664bb35c5c20fe361274c983ac"`);
        await queryRunner.query(`ALTER TABLE "comment_like" DROP CONSTRAINT "FK_fd7207639a77fa0f1fea8943b78"`);
        await queryRunner.query(`ALTER TABLE "anime_comment" DROP CONSTRAINT "FK_7aefefc9042fcddd314f26aa87e"`);
        await queryRunner.query(`ALTER TABLE "anime_comment" DROP CONSTRAINT "FK_61a9600a9487cf27ad877208902"`);
        await queryRunner.query(`DROP TABLE "episode_comment"`);
        await queryRunner.query(`DROP TABLE "comment_like"`);
        await queryRunner.query(`DROP TABLE "anime_comment"`);
    }

}
