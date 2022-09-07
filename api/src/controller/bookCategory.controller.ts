import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { BookCategory } from "../entity/BookCategory";

class BookCategoryController {
    private readonly repository: Repository<BookCategory>;

    constructor() {
        this.repository = AppDataSource.getRepository(BookCategory);
    }

    /**
     * 
     * @description Get all info of a book category using the ID stored in "req.body.bookCategoryId"
     */
    public async get(id: number): Promise<BookCategory | null> {
        return this.repository.findOne({
            where: { id: id }
        })
    }

    /**
     * 
     * @description name in "req.body.bookCategoryName" and books in "req.body.bookList"
     */
    public async create(req: Request, res: Response) {
        try{
            await this.repository.save({
                name: req.body.bookCategoryName,
                books: (req.body.bookList) ? req.body.bookList : []
            })
        } catch(err){
            res.status(500).send({err: true, msg: err})
        }
    }
}

export const bookCategoryController= new BookCategoryController();