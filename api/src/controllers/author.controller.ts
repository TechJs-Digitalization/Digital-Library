import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";

export class AuthorController {
    static #repository: Repository<Author>;
    static {
        AuthorController.#repository = AppDataSource.getRepository(Author);
    }

    static async get(id: number){
        return AuthorController.#repository.findOne({
            where: {id: id}
        })
    }
    
    static async getWithAuthorPics(id: number): Promise<Author | null>{
        return AuthorController.#repository.findOne({
            where: {id: id},
            relations: {
                nomDePlumes: {
                    value: true
                }
            }
        })
    }

    static async verifyAuthorExist(id: number): Promise<boolean> {
        const author = await AuthorController.#repository.preload({
            id: id
        });

        return (author != undefined);
    }

}