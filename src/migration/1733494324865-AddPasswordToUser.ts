import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1733494324865 implements MigrationInterface {
    name = 'AddPasswordToUser1733494324865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
