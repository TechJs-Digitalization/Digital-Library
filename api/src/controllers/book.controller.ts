import { NextFunction, Request, Response } from "express";
import { join } from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import { getBasenames } from "../services/fileUpload";

export default class BookController {
    static #repository: Repository<Book>;
    static {
        BookController.#repository = AppDataSource.getRepository(Book);
    }
    static readonly pictureDir = join(__dirname, '..', '..', 'public', 'bookPictures');

    static async getById(req: Request, res: Response, next: NextFunction){
        const id= Number(req.params.id);
        if(Number.isInteger(id)){
            let result = await BookController.#repository.findOne({
                relations: {
                    category: true,
                    author: {
                        nomDePlumes: true
                    }
                },
                select: {
                    author: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nomDePlumes: {
                            value: true
                        }
                    }
                },
                where: {
                    id: id
                }
            })
            if (result) return res.status(200).json({ err: false, data: result });
        }
        res.status(404).json({ err: true, msg: 'Book not found' });
    }


    static async save(req: Request, res: Response, next: NextFunction) {
        const [title, synopsis, available] = [req.fields.title[0]!, req.fields.synopsis[0]!, req.fields.available[0]!];
        const coverName = req.files.cover[0].newFilename;

        try {
            await BookController.#repository.save({
                title: title,
                available: Number(available),
                coverPicture: coverName,
                synopsis: synopsis,
                author: {id: Number(req.fields.author)},
                category: {id: Number(req.fields.category)}
            })
            res.status(201).json({ err: false, msg: 'Book successfully created' });
        } catch (error) {
            res.status(500).json({err: true, msg: 'Something broke'})
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        const id= Number(req.params.id);
        let bookUpdate: {[keys: string]: any}= {};
        const tmp= new Book();
        for(let prop in req.fields){
            if(prop in tmp && req.fields[prop][0]){
                switch (prop) {
                    case "available":
                        bookUpdate[prop]= Number(req.fields[prop][0]);
                        break;

                    case "category":
                    case "author":
                        bookUpdate[prop]= {id: Number(req.fields[prop][0]!)};
                        break;
                
                    default:
                        if(prop != "bookCheckout" && prop != "coverPic")
                            bookUpdate[prop]= req.fields[prop][0];
                        break;
                }
            }
        }
        if('cover' in req.files)
            bookUpdate.coverPicture= req.files.cover[0].newFilename;

        try {
            await BookController.#repository.update({id: id}, bookUpdate)
        } catch (error) {
            res.status(500).json({err: true, msg: 'Something broke'});
            return next(error);
        }

        const msg= `Book updated: ${Object.keys(bookUpdate).join(', ')} updated.`;

        res.status(200).json({err: false, msg: msg})
    }

    static async verifyBookExist(id: number): Promise<boolean> {
        const book = await BookController.#repository.preload({
            id: id
        });

        return (book != undefined);
    }

    static async verifyIfExistByAuthor(title: string, author: number) {
        const found = await BookController.#repository.createQueryBuilder('book')
            .leftJoin('book.author', 'author')
            .select(['book.title'])
            .where('author.id= :id', { id: author })
            .andWhere('book.title= :t', { t: title })
            .getOne()
        return (found != null);
    }
}