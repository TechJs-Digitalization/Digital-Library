import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { BookCategory } from "../entity/BookCategory";

export class BookCategoryController {
    static #repository: Repository<BookCategory>;
    static {
        BookCategoryController.#repository = AppDataSource.getRepository(BookCategory);
    }

    /**
     * 
     * @description Get all info of a book category using the ID stored in "req.body.bookCategoryId"
     */
    static async get(id: number): Promise<BookCategory | null> {
        return BookCategoryController.#repository.findOne({
            where: { id: id }
        })
    }

    /**
     * 
     * @description name in "req.body.bookCategoryName" and books in "req.body.bookList"
     */
    static async create(req: Request, res: Response) {
        try {
            await BookCategoryController.#repository.save({
                name: req.body.bookCategoryName,
                books: (req.body.bookList) ? req.body.bookList : []
            })
        } catch (err) {
            res.status(500).send({ err: true, msg: err })
        }
    }

    static async verifyCategoryExist(id: number): Promise<boolean> {
        const category = await BookCategoryController.#repository.preload({
            id: id
        });

        return (category != undefined);
    }
}