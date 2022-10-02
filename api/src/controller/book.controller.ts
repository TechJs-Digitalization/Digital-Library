import {join} from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import { bookPictureController } from "./BookPicture.controller";

export default class BookController{
    static #repository: Repository<Book>;
    static{
        BookController.#repository= AppDataSource.getRepository(Book);
    }
    static readonly pictureDir= join(__dirname, '..','..','public', 'bookPictures');

    static async get(id: number): Promise< Book | null>{
        let result= await BookController.#repository.findOne({
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
                    nomDePlumes:{
                        value: true
                    }
                },
                bookPics:{
                    fileName: true
                }
            },
            where: {
                id: id
            }
        })
        if(result){
            result.coverPic= '/bookPictures/'+ result.coverPic;

            if(result.bookPics)
                result.bookPics.forEach(pic => pic.fileName= '/bookPictures/' + pic.fileName); 
        }
        return result;
    }

    
    static async save(title:string, synopsis: string, author:Author, available:number, category:BookCategory, coverPic:string, picsNames: string[]){
        const pics= await bookPictureController.save(...picsNames);

        await BookController.#repository.save({
            title: title,
            available: available,
            coverPic: coverPic,
            synopsis: synopsis,
            author: author,
            category: category,
            bookPics: pics,
        })
    }

    static async update(id: number, title: string, synopsis: string, author: number | null, available:number, category: number | null, coverPic?: string){
        if(coverPic)
            await BookController.#repository.update({id: id},{
                title: title,
                available: available,
                synopsis: synopsis,
                coverPic: coverPic,
            });
        else
            await BookController.#repository.update({id: id},{
                title: title,
                available: available,
                synopsis: synopsis,
            });

        await BookController.#repository.createQueryBuilder()
            .relation('author')
            .of(id)
            .set(author)

        await BookController.#repository.createQueryBuilder()
            .relation('category')
            .of(id)
            .set(category);
    }

    static async getCoverPicture(id: number): Promise<string | null>{
        const result= await BookController.#repository.findOne({
            where: {id: id},
            select: {coverPic: true}
        })

        if(result)
            return join(BookController.pictureDir, result.coverPic);

        return null;
    }

    static async verifyBookExist(id: number) : Promise<boolean>{
        const book= await BookController.#repository.preload({
            id: id
        });

        return (book!=undefined);
    }

    static async verifyIfExistByAuthor(title:string, authorId:number){
        const found= await BookController.#repository.createQueryBuilder('book')
            .leftJoin('book.author', 'author')
            .select(['book.title'])
            .where('author.id= :id', {id: authorId})
            .andWhere('book.title= :t', {t: title})
            .getOne()
        return (found!=null);
    }
}