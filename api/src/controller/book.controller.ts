import { Request, Response } from "express";
import formidable from "formidable";
import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { BookPicture } from "../entity/BookPicture";
import { replaceFileName } from "../services/fileRelated";
import { bookCategoryController } from "./bookCategory.controller";

class BookController{
    private readonly repository: Repository<Book>;
    private readonly pictureDir= path.join(__dirname, 'public', 'bookPictures');

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
                    nomDePlumes: {
                        value: true
                    }
                }
            }
        })
    }

    
    public async saveBook(req: Request, res:Response){
        const form= formidable({
            multiples: true,
            maxFileSize: 20*1024*1024, //20MB 
            uploadDir: this.pictureDir,

            // ----------------ETO ZAO
        })


        const category= await bookCategoryController.getAllInfoSingleBookCategory(req, res)
        const {imageList, title, author, available} = req.body;

        for(let i=0; i<imageList.length; i++){
            const newName= title + '-' + i;
            const fileName= replaceFileName(imageList[i].fileName, newName);
            imageList[i]= new BookPicture(fileName);
            console.log(imageList[i].id);
        }

        if(category)
            this.repository.save({
                title: title,
                author: author,
                available: Number(available),
                category: category
            })
        else
            res.status(500).send({err: true, msg: 'Category not found'})
    }
}
export const bookController= new BookController();