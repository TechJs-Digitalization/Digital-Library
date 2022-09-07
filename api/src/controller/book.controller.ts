import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import { BookPicture } from "../entity/BookPicture";
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

    
    public async save(title:string, synopsis: string, author:Author, available:number, category:BookCategory, coverName:string, pictures: BookPicture[]){
        if(!(title && author && available && category && category && coverName && pictures))
            throw new Error('All fields should be filled')
        this.repository.save({
            title: title,
            available: available,
            coverName: coverName,
            synopsis: synopsis,
            author: author,
            category: category,
            bookPics: pictures,
        })
    }
}
export const bookController= new BookController();