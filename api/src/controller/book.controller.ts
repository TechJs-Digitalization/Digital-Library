import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import { BookPicture } from "../entity/BookPicture";
import { bookPictureController } from "./BookPicture.controller";

//nom des fichier couverture: titre_authorId_cover.ext
//nom edes fichiers illustrations: titre_authorId_X.ext

class BookController{
    private readonly repository: Repository<Book>;
    readonly pictureDir= path.join(__dirname, '..','..','public', 'bookPictures');

    constructor(){
        this.repository= AppDataSource.getRepository(Book);    
    }

    public async get(id: number): Promise< Book | null>{
        return this.repository.findOne({
            where: {id: id},
            relations: {
                bookPics: {
                    fileName: true
                },
                author:{
                    id: true,
                    lastName: true,
                    firstName: true,
                    nomDePlumes: {
                        value: true
                    }
                }
            }
        })
    }

    
    public async save(title:string, synopsis: string, author:Author, available:number, category:BookCategory, coverName:string, picsNames: string[]){
        if(!(title && author && available && category && category && coverName && picsNames))
            throw new Error('All fields should be filled')

        const pics= await bookPictureController.save(...picsNames);

        await this.repository.save({
            title: title,
            available: available,
            coverName: coverName,
            synopsis: synopsis,
            author: author,
            category: category,
            bookPics: pics,
        })
    }

    public async verifyIfExistByAuthor(title:string, authorId:number){
        const found= await this.repository.createQueryBuilder('book')
            .leftJoin('book.author', 'author')
            .select(['book.title'])
            .where('author.id= :id', {id: authorId})
            .andWhere('book.title= :t', {t: title})
            .getOne()
        return (found!=null);
    }
}
export const bookController= new BookController();