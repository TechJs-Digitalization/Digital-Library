import { Entity, ManyToOne } from "typeorm";
import { Picture } from "./abstract/Pictures";
import { AppDataSource } from "../data-source";
import { nanoid } from "nanoid";
import { getNewFileName } from "../services/fileRelated";
import { Book } from "./Book";

@Entity()
export class BookPicture extends Picture{
    @ManyToOne(()=>Book, (book)=>book.bookPics)
    book: Book;

    constructor(fileName:string){
        super();
        this.setRandomFileName(fileName);
    }
    
    protected async setRandomFileName(fileName:string){
        let temp: string, found: Partial<BookPicture> | null;
        do{
            temp= getNewFileName(nanoid(10), fileName);
            found= await AppDataSource.manager
                .createQueryBuilder(BookPicture, "bookPicture")
                .where("bookPicture.fileName= :fileName", {fileName: temp})
                .getOne()
        }while(found);
    
        this.fileName= temp;
    }
}