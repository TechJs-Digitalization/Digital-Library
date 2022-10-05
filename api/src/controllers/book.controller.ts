import { NextFunction, Request, Response } from "express";
import { join } from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { BookPicture } from "../entity/BookPicture";
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
                    },
                    bookPics: true
                },
                select: {
                    author: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        nomDePlumes: {
                            value: true
                        }
                    },
                    bookPics: {
                        fileName: true
                    }
                },
                where: {
                    id: id
                }
            })
            if (result) {
                result.coverPic = '/bookPictures/' + result.coverPic;
    
                if (result.bookPics)
                    result.bookPics.forEach(pic => pic.fileName = '/bookPictures/' + pic.fileName);

                return res.status(200).json({ err: false, data: result });
            }
        }
        res.status(404).json({ err: true, msg: 'Book not found' });
    }


    static async save(req: Request, res: Response, next: NextFunction) {
        if (!req.files.cover) return next(new Error('Please upload a cover picture file'));
        if (!req.files.pictures) return next(new Error('Please upload at least one illustration picture file'));

        const [title, synopsis, available] = [req.fields.title[0]!, req.fields.synopsis[0]!, req.fields.available[0]!];
        const coverName = getBasenames(...req.files.cover)!;
        const picsNames = getBasenames(...req.files.pictures)!; 
        const pics= picsNames.map(pic => new BookPicture(pic));

        try {
            await BookController.#repository.save({
                title: title,
                available: Number(available),
                coverPic: coverName[0],
                synopsis: synopsis,
                author: {id: Number(req.fields.author)},
                category: {id: Number(req.fields.category)},
                bookPics: pics,
            })
            res.status(201).json({ err: false, msg: 'Book successfully created' });
        } catch (error) {
            if(error instanceof Error)
                next(error);
        }
    }

    // static async update(id: number, title: string, synopsis: string, author: number | null, available: number, category: number | null, coverPic?: string) {
    //     if (coverPic)
    //         await BookController.#repository.update({ id: id }, {
    //             title: title,
    //             available: available,
    //             synopsis: synopsis,
    //             coverPic: coverPic,
    //         });
    //     else
    //         await BookController.#repository.update({ id: id }, {
    //             title: title,
    //             available: available,
    //             synopsis: synopsis,
    //         });

    //     await BookController.#repository.createQueryBuilder()
    //         .relation('author')
    //         .of(id)
    //         .set(author)

    //     await BookController.#repository.createQueryBuilder()
    //         .relation('category')
    //         .of(id)
    //         .set(category);
    // }

    static async getCoverPicture(id: number): Promise<string | null> {
        const result = await BookController.#repository.findOne({
            where: { id: id },
            select: { coverPic: true }
        })

        if (result)
            return join(BookController.pictureDir, result.coverPic);

        return null;
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