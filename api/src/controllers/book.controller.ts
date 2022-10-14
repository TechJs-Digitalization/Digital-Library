import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";

export default class BookController {
    static repository= AppDataSource.getRepository(Book);

    static async getById(req: Request, res: Response, next: NextFunction){
        const id= Number(req.params.id);
        if(Number.isInteger(id)){
            let result = await BookController.repository.findOne({
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
        const [title, synopsis, available] = [req.fields.title!, req.fields.synopsis!, req.fields.available!];
        const coverName = req.files.cover[0].newFilename;

        try {
            await BookController.repository.save({
                title: title.trim(),
                available: Number(available),
                dispo: req.fields.dispo==='true',
                coverPicture: coverName,
                synopsis: synopsis.trim(),
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
            
            if(prop in tmp){
                switch (prop) {
                    case "available":
                        bookUpdate[prop]= Number(req.fields[prop]);
                        break;
                        
                    case "dispo":
                        bookUpdate[prop]= (req.fields.dispo==='true');
                        break;

                    case "category":
                    case "author":
                        bookUpdate[prop]= {id: Number(req.fields[prop]!)};
                        break;
                
                    default:
                        if(prop != "bookCheckout" && prop != "coverPic")
                            bookUpdate[prop]= req.fields[prop].trim();
                        break;
                }
            }
        }
        if('cover' in req.files)
            bookUpdate.coverPicture= req.files.cover[0].newFilename;

        try {
            await BookController.repository.update({id: id}, bookUpdate)
        } catch (error) {
            res.status(500).json({err: true, msg: error});
            return next(error);
        }

        const msg= `Book updated: ${Object.keys(bookUpdate).join(', ')} updated.`;

        res.status(200).json({err: false, msg: msg})
    }

    static async delete(req: Request, res: Response){
        await BookController.repository.delete(Number(req.params.id));
        res.status(200).json({err: false, msg: 'Book deleted successful'})
    }

    static async verifyBookExist(id: number): Promise<boolean> {
        const book = await BookController.repository.preload({
            id: id
        });

        return (book != undefined);
    }

    static async verifyIfExistByAuthor(title: string, author: number) {
        const found = await BookController.repository.createQueryBuilder('book')
            .leftJoin('book.author', 'author')
            .select(['book.title'])
            .where('author.id= :id', { id: author })
            .andWhere('book.title= :t', { t: title })
            .getOne()
        return (found != null);
    }
}