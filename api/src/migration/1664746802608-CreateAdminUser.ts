import { MigrationInterface, QueryRunner } from "typeorm"
import { AppDataSource } from "../data-source";
import { User } from "../entity/User"

export class CreateAdminUser1664746802608 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User("admin", "admin", new Date("2000-04-11"), "admin@gmail.com", "ADMIN");
        user.password = "admin";
        user.hashPassword();
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
