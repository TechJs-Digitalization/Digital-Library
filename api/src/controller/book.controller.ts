import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import { bookPictureController } from "./BookPicture.controller";

//nom des fichier couverture: titre_authorId_cover.ext
//nom edes fichiers illustrations: titre_authorId_X.ext

class BookController{
    private readonly repository: Repository<Book>;
    readonly pictureDir= path.join(__dirname, '..','..','public', 'bookPictures');

    constructor(){
        this.repository= AppDataSource.getRepository(Book);    
    }

    public async get(id: number)/* : Promise< Book | null> */{
        let result= await this.repository.findOne({
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
            result.coverName= '/bookPictures/'+ result.coverName;

            if(result.bookPics)
                result.bookPics.forEach(pic => pic.fileName= '/bookPictures/' + pic.fileName); 
        }
        return result;
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