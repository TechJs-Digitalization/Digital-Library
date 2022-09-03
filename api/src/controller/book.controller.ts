import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { bookCategoryController } from "./bookCategory.controller";

class BookController{
    private readonly repository: Repository<Book>;

    constructor(){
        this.repository= AppDataSource.getRepository(Book);
    }

    public async getAllInfoSingleBook(req: Request, res: Response): Promise< Book | null>{
        return this.repository.findOne({
            where: {id: Number(req.query.bookId)},
            relations: {
                bookPics: {
                    fileName: true
                },
                author:{
                    id: true,
                    nomDePlumes:{
                        value: true
                    }
                }
            }
        })
    }

    public async saveBook(req: Request, res:Response){
        const category= await bookCategoryController.getAllInfoSingleBookCategory(req, res)

        if(category)
            this.repository.save({
                title: req.body.tilte,
                author: req.body.author,
                available: Number(req.body.available),
                category: category
            })
        else
            res.status(500).send({err: true, msg: 'Category not found'})
    }
}

export const bookController= new BookController;