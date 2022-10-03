import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";

class AuthorController {
    private readonly repository: Repository<Author>;

    constructor() {
        this.repository = AppDataSource.getRepository(Author);
    }

    public async get(id: number){
        return this.repository.findOne({
            where: {id: id}
        })
    }
    
    public async getWithAuthorPics(id: number): Promise<Author | null>{
        return this.repository.findOne({
            where: {id: id},
            relations: {
                authorPics: true,
                nomDePlumes: {
                    value: true
                }
            }
        })
    }

}

export const authorController= new AuthorController();